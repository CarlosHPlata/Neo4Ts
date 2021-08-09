import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { MultipleDeleteService } from './cypherParts/delete/multiple.delete.service';
import * as Neo4JDriver from 'neo4j-driver';

export class DeleteMultipleAction extends DBAction {
    protected returnBuilderCallBack = () => '';

    protected buildQueryBody(params: ParamsHolder): string {
        const deleteMultipleService = new MultipleDeleteService(
            this.LINE_BREAK,
            this.TAB_CHAR
        );

        const query: string = deleteMultipleService.getCypher(
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
