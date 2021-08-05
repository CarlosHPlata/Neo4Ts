import { IGraphEntity } from '../../../../core/entities';
import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { IDBExecuter } from '../../../../core/interfaces/dbexecuter.adapter';
import { simpleReturnBuilder } from './cypherParts/return/return.builder.service';
import * as Neo4JDriver from 'neo4j-driver';
import { CypherBuilder } from './cypherParts/cypher.builder';
import { CreateService } from './cypherParts/create/create.service';

export class CreateBuilder extends DBAction {
    constructor(
        entities: IGraphEntity[],
        private target: IGraphEntity,
        adapter?: IDBExecuter
    ) {
        super(entities, adapter);
        this.returnBuilderCallBack = simpleReturnBuilder;
    }

    protected buildQueryBody(params: ParamsHolder): string {
        const createBuilder: CypherBuilder = new CreateService(
            this.LINE_BREAK,
            this.TAB_CHAR
        );

        const query: string = createBuilder.getCypher(
            this.entities,
            params,
            this.target
        );

        return query;
    }

    executeRaw(): Promise<Neo4JDriver.QueryResult> {
        const query: string = this.getQuery();
        const params: any = this.getParamsForDatabaseUse();

        return this.executerAdapter.run(query, params);
    }
}
