import { IDBExecuter } from '../interfaces/dbexecuter.adapter';
import { DBAction } from './db.action';
import { ParamsHolder } from './paramsHolder';
import * as Neo4JDriver from 'neo4j-driver';

export class CypherAction extends DBAction {
    protected isFunctionOverrided = true;

    constructor(
        private query: string,
        private rawParams: any,
        adapter?: IDBExecuter
    ) {
        super([], adapter);
    }

    protected buildQueryBody(): string {
        return '';
    }

    /**
     * It will execute the action into the Data Base, using Neo4J Driver to connect and execute the cypher, using the cypher and parameters assigned to this action
     * After executing the action it will try to parse the result to a more friendly JSON form.
     * @returns
     */
    executeRaw(): Promise<Neo4JDriver.QueryResult> {
        if (!this.query) throw new Error('Can not execute an empty query');
        return this.executerAdapter.run(this.query, this.rawParams);
    }

    /**
     * set query parameters to be executed among your query
     * @param {any} parameters: a set of parameters for the database
     * @return {DBAction} The same aciton to chain functionalities
     */
    setQueryParameters(parameters: any): DBAction {
        this.rawParams = parameters;
        return this;
    }

    overrideReturnAction(): DBAction {
        throw new Error(
            'On cypher actions there is no return action to override'
        );
    }

    setEntities(): DBAction {
        throw new Error('On cypher actions there is no entities');
    }

    getParamHolder(): ParamsHolder {
        throw new Error('On cypher actions there is no param holder');
    }
}
