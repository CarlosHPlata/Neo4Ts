import { DBAction } from '../../../../core/entities/db.action';
import { ParamsHolder } from '../../../../core/entities/paramsHolder';
import { MultipleDeleteService } from './cypherParts/delete/multiple.delete.service';
import * as Neo4JDriver from 'neo4j-driver';
import { IGraphEntity } from '../../../../core/entities';
import { RETUNR_KEYWORD } from './cypherParts/cypher.charactes';

export class DeleteMultipleAction extends DBAction {
    protected returnBuilderCallBack = () => '';
    protected RETURN_KEYWORD: string = '';

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

    overrideReturnAction(
        callBack: (entities: IGraphEntity[], params: ParamsHolder) => string
    ): DBAction {
        this.RETURN_KEYWORD = RETUNR_KEYWORD;
        super.overrideReturnAction(callBack);
        return this;
    }
}
