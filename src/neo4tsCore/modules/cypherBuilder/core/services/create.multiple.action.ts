import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { MultipleCreateService } from './cypherParts/create/multiple.create.service';
import { simpleReturnBuilder } from './cypherParts/return/return.builder.service';
import * as Neo4JDriver from 'neo4j-driver';

export class MultipleCreateAction extends DBAction {
    protected returnBuilderCallBack = simpleReturnBuilder;

    protected buildQueryBody(params: ParamsHolder): string {
        const createMultipleService: MultipleCreateService = new MultipleCreateService(
            this.LINE_BREAK,
            this.TAB_CHAR
        );

        const query: string = createMultipleService.getCypher(
            this.entities,
            params
        );

        return query;
    }

    executeRaw(): Promise<Neo4JDriver.QueryResult> {
        const query: string = this.getQuery();
        const params: any = this.getParamsForDatabaseUse();

        return this.executerAdapter.run(query, params);
    }
}
