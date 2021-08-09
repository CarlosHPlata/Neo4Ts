import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { simpleReturnBuilder } from './cypherParts/return/return.builder.service';
import { MultipleUpdateService } from './cypherParts/update/multiple.update.service';
import * as Neo4JDriver from 'neo4j-driver';

export class UpdateMultipleAction extends DBAction {
    protected returnBuilderCallBack = simpleReturnBuilder;

    protected buildQueryBody(params: ParamsHolder): string {
        const updateBuilder = new MultipleUpdateService(
            this.LINE_BREAK,
            this.TAB_CHAR
        );

        const query: string = updateBuilder.getCypher(this.entities, params);

        return query;
    }

    executeRaw(): Promise<Neo4JDriver.QueryResult> {
        const query: string = this.getQuery();
        const params: any = this.getParamsForDatabaseUse();

        return this.executerAdapter.run(query, params);
    }
}
