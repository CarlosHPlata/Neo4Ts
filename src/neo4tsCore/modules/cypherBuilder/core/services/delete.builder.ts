import { IGraphEntity } from '../../../../core/entities';
import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { IDBExecuter } from '../../../../core/interfaces/dbexecuter.adapter';
import { CypherBuilder } from './cypherParts/cypher.builder';
import { DeleteService } from './cypherParts/delete/delete.service';
import * as Neo4JDriver from 'neo4j-driver';

export class DeleteBuilder extends DBAction {
    constructor(
        entities: IGraphEntity[],
        private target: IGraphEntity,
        adapter?: IDBExecuter
    ) {
        super(entities, adapter);
        this.returnBuilderCallBack = () => '';
    }

    protected buildQueryBody(params: ParamsHolder): string {
        const deleteService: CypherBuilder = new DeleteService(
            this.LINE_BREAK,
            this.TAB_CHAR
        );

        const query: string = deleteService.getCypher(
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
