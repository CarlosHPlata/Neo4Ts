import {DBExecuter} from "../../infrastructure/adapters/dbexecuter.adapter";
import {MIN_CHARACTERS, PRETTY_CHARACTERS, RETUNR_KEYWORD} from "../../modules/cypherBuilder/core/services/cypherParts/cypher.charactes";
import {IDBExecuter} from "../interfaces/dbexecuter.adapter";
import {IGraphEntity} from "./neoEntities/graph.entity";
import {ParamsHolder} from "./paramsHolder";
import * as GenericTranslator from "../../modules/resultParser/GenericTranslator";

export abstract class DBAction {
    protected LINE_BREAK: string = MIN_CHARACTERS.LINE_BREAK;
    protected TAB_CHAR: string = MIN_CHARACTERS.TAB_CHAR;

    protected RETURN_KEYWORD: string = RETUNR_KEYWORD;

    protected returnBuilderCallBack: (entities: IGraphEntity[], params: ParamsHolder) => string = () => '';

    private paramsHolder: ParamsHolder;
    protected entities: IGraphEntity[] = [];
    protected executerAdapter: IDBExecuter;

    constructor(
        entities: IGraphEntity[]
    ) {
        this.paramsHolder = new ParamsHolder();
        this.setEntities(entities);
        this.executerAdapter = new DBExecuter();
    }


    getParamsForDatabaseUse(): any {
        const paramHolder: ParamsHolder = this.getParamHolder();
        return paramHolder.getParamsForDatabaseUse();
    }

    getQuery(): string {
        this.LINE_BREAK = MIN_CHARACTERS.LINE_BREAK;
        this.TAB_CHAR = MIN_CHARACTERS.TAB_CHAR;

        return this.generateQuery();
    }

    getPrettyQuery(): string {
        this.LINE_BREAK = PRETTY_CHARACTERS.LINE_BREAK;
        this.TAB_CHAR = PRETTY_CHARACTERS.TAB_CHAR;

        return this.generateQuery();
    }

    setEntities(entities: IGraphEntity[]): void {
        this.entities = entities;
        this.setParameters();
    }

    overrideReturnAction(callBack: (entities: IGraphEntity[], params: ParamsHolder) => string): void {
        this.returnBuilderCallBack = callBack;
    }

    getParamHolder(): ParamsHolder {
        return this.paramsHolder;
    }

    async execute(): Promise<any> {
        const rawRes = await this.executeRaw();
        return GenericTranslator.MapToJson(rawRes);
    }

    abstract executeRaw(): Promise<any>;

    protected abstract buildQueryBody(params: ParamsHolder): string;

    protected buildAfterQueryReturnDecorators(params: ParamsHolder): string {
        if (params) return '';
        return '';
    }

    protected buildQueryReturn(params: ParamsHolder): string {
        const res: string = [
            this.RETURN_KEYWORD,
            this.LINE_BREAK,
            this.returnBuilderCallBack(this.entities, params),
        ].join('');

        return res;
    }

    private generateQuery(): string {
        const params: ParamsHolder = this.getParamHolder();

        const body =  this.buildQueryBody(params);
        const returnPart = this.buildQueryReturn(params);
        const decos = this.buildAfterQueryReturnDecorators(params);

        const query: string = [
            body,
            returnPart,
            decos? this.LINE_BREAK : '',
            decos
        ].join('');

        return query;
    }

    private setParameters(): void {
        this.paramsHolder.addParammeters(this.entities);
    }
}
