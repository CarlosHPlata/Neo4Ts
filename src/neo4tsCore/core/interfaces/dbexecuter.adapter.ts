import { QueryResult } from 'neo4j-driver';

export interface IDBExecuter {
    run(query: string, parameters: any): Promise<QueryResult>;
}
