import { IDBExecuter } from '../../core/interfaces/dbexecuter.adapter';
import * as Neo4JDriver from 'neo4j-driver';
import { DriverAdapter } from './driver.adapter';

export class DBExecuter implements IDBExecuter {
    private driverAdapter: DriverAdapter;

    constructor() {
        this.driverAdapter = DriverAdapter.getInstance();
    }

    async run(
        query: string,
        parameters: any
    ): Promise<Neo4JDriver.QueryResult> {
        const session = this.getSession();
        let result = null;

        try {
            result = await session.run(query, parameters);
        } catch (err) {
            console.log(err);
            console.log('Error caught, Retrying...');
            result = await session.run(query, parameters);
        } finally {
            session.close();
        }

        return result;
    }

    private getSession(): Neo4JDriver.Session {
        return this.driverAdapter.getDriver().session();
    }
}
