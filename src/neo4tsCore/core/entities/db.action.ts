import { DBExecuter } from '../../infrastructure/adapters/dbexecuter.adapter';
import {
    MIN_CHARACTERS,
    PRETTY_CHARACTERS,
    RETUNR_KEYWORD,
} from '../../modules/cypherBuilder/core/services/cypherParts/cypher.charactes';
import { IDBExecuter } from '../interfaces/dbexecuter.adapter';
import { IGraphEntity } from './neoEntities/graph.entity';
import { ParamsHolder } from './paramsHolder';
import * as GenericTranslator from '../../modules/resultParser/GenericTranslator';
import * as Neo4JDriver from 'neo4j-driver';
import * as Neo4TSTranslator from '../../modules/resultParser/Neo4TSTranslator';

export abstract class DBAction {
    protected LINE_BREAK: string = MIN_CHARACTERS.LINE_BREAK;
    protected TAB_CHAR: string = MIN_CHARACTERS.TAB_CHAR;

    protected RETURN_KEYWORD: string = RETUNR_KEYWORD;

    protected returnBuilderCallBack: (
        entities: IGraphEntity[],
        params: ParamsHolder
    ) => string = () => '';

    private paramsHolder: ParamsHolder;
    protected isFunctionOverrided: boolean = false;

    protected entities: IGraphEntity[] = [];
    protected executerAdapter: IDBExecuter;

    constructor(entities: IGraphEntity[], adapter?: IDBExecuter) {
        this.paramsHolder = new ParamsHolder();
        this.setEntities(entities);

        if (adapter) this.executerAdapter = adapter;
        else this.executerAdapter = new DBExecuter();
    }

    /**
     * Return a params Object that you can inject to a Neo4J Database Driver, or to export it as JSON
     * @returns {Records<string, any>}
     */
    getParamsForDatabaseUse(): any {
        const paramHolder: ParamsHolder = this.getParamHolder();
        return paramHolder.getParamsForDatabaseUse();
    }

    /**
     * Converts the entities and returns a minified version of the cypher query in string form.
     * @returns {string}
     */
    getQuery(): string {
        this.LINE_BREAK = MIN_CHARACTERS.LINE_BREAK;
        this.TAB_CHAR = MIN_CHARACTERS.TAB_CHAR;

        return this.generateQuery();
    }

    /**
     * Converts the entities and return a prettified version of the cypher query in string form.
     * @returns
     */
    getPrettyQuery(): string {
        this.LINE_BREAK = PRETTY_CHARACTERS.LINE_BREAK;
        this.TAB_CHAR = PRETTY_CHARACTERS.TAB_CHAR;

        return this.generateQuery();
    }

    /**
     * Set new entities to the DBAction this will also auto generate a new set of params to use.
     * @param {IGraphEntity[]} entities - a set of entities used to build the cypher query
     * @returns
     */
    setEntities(entities: IGraphEntity[]): DBAction {
        this.entities = entities;
        this.setParameters();
        return this;
    }

    /**
     * Override the "return" cypher generator function, you can set a new string cypher function to inject
     * custom behaviour at the return part of your query
     * @example
     * // this will return a cypher like:
     * // match(n) return 'hello world';
     * action.overrideReturnAction( () => '\'hello world\'' ).getQuery();
     * @param callBack - This callback will be executed when Neo4TS generates the return part of the cypher query
     * @returns
     */
    overrideReturnAction(
        callBack: (entities: IGraphEntity[], params: ParamsHolder) => string
    ): DBAction {
        this.isFunctionOverrided = true;
        this.returnBuilderCallBack = callBack;
        return this;
    }

    /**
     * Returns the param Holder which contains the parameters that will be used by this aciton.
     * @returns
     */
    getParamHolder(): ParamsHolder {
        return this.paramsHolder;
    }

    /**
     * It will execute the action into the Data Base, using Neo4J Driver to connect and execute the cypher, using the entities assigned to this action
     * After executing the action it will try to parse the result to a more friendly JSON form.
     * @returns
     */
    async execute(): Promise<any> {
        const rawRes = await this.executeRaw();
        if (this.isFunctionOverrided)
            return GenericTranslator.MapToJson(rawRes);

        return Neo4TSTranslator.mapToDto(rawRes, this.entities);
    }

    /**
     * It will execute the action into the Data Base, using Neo4J Driver to connect and execute the cypher, using the entities assigned to this action
     * It will return the raw response from Neo4J Driver
     * @returns
     */
    abstract executeRaw(): Promise<Neo4JDriver.QueryResult>;

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

        const body = this.buildQueryBody(params);
        const returnPart = this.buildQueryReturn(params);
        const decos = this.buildAfterQueryReturnDecorators(params);

        const query: string = [
            body,
            returnPart,
            decos ? this.LINE_BREAK : '',
            decos,
        ].join('');

        return query;
    }

    private setParameters(): void {
        this.paramsHolder.addParammeters(this.entities);
    }
}
