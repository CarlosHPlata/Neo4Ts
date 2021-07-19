import {IGraphEntity} from "./neoEntities/graph.entity";
import {ParamsHolder} from "./paramsHolder";

export abstract class DBAction {
    constructor(
        protected entities: IGraphEntity[]
    ) {}

    getQuery(): string {
        const params: ParamsHolder = this.getParamHolder();
        const query = this.buildQuery(params);
        return query;
    }

    protected abstract buildQuery(params: ParamsHolder): string;

    getParams(): any {
        const paramHolder: ParamsHolder = this.getParamHolder();
        return paramHolder.getParamsForDB();
    }

    private getParamHolder(): ParamsHolder {
        const paramHolder: ParamsHolder = new ParamsHolder();
        paramHolder.addParammeters(this.entities);

        return paramHolder;
    }

}
