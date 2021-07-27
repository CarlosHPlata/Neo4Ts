import {DBAction} from "../../../../core/entities/db.action";
import {IGraphEntity} from "../../../../core/entities/neoEntities/graph.entity";
import {ParamsHolder} from "../../../../core/entities/paramsHolder";
import {CypherBuilder} from "./cypherParts/cypher.builder";
import {generateSkipAndLimit} from "./cypherParts/decorators/skipLimit.builder";
import {simpleReturnBuilder} from "./cypherParts/return/return.builder.service";
import {SelectBuilder} from "./cypherParts/select/select.service";

export class RetrieveBuilder extends DBAction {
    page: number|undefined;
    size: number|undefined;

    constructor(
        entities: IGraphEntity[]
    ) {
        super(entities);
        this.returnBuilderCallBack = simpleReturnBuilder;
    }

    protected buildQueryBody(params: ParamsHolder): string {
        const selectBuilder: CypherBuilder = new SelectBuilder(this.LINE_BREAK, this.TAB_CHAR);
        let query: string = this.buildSelect(params, selectBuilder);

        return query;
    }

    private buildSelect(params: ParamsHolder, selectBuilder: CypherBuilder): string {
        return selectBuilder.getCypher(this.entities, params);
    }

    protected buildAfterQueryReturnDecorators(): string {
        return generateSkipAndLimit(this.page, this.size);
    }

    executeRaw(): Promise<any> {
        const query: string = this.getQuery();
        const params: any = this.getParamsForDatabaseUse();

        return this.executerAdapter.run(query, params);
    }
   
}
