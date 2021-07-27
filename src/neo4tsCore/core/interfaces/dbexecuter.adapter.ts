
export interface IDBExecuter {
    run(query: string, parameters: any): Promise<any>;
}
