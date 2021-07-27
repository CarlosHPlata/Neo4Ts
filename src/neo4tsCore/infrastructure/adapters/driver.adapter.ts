import * as Neo4JDriver from 'neo4j-driver';
import {getConfiguration} from '../../modules/configManager/configManager.presenter';
import {ConfigurationManager} from '../../modules/configManager/core/entities/configManager';

export class DriverAdapter {
    private static instance: DriverAdapter;

    driver: Neo4JDriver.Driver;
    private configManager: ConfigurationManager;

    private constructor() {
        this.configManager = getConfiguration();
        this.driver = this.getNewDriver();
    }

    static getInstance(): DriverAdapter {
        if (!DriverAdapter.instance) {
            DriverAdapter.instance = new DriverAdapter();
        }

        return DriverAdapter.instance;
    }

    getNewDriver(): Neo4JDriver.Driver {
        const url = this.configManager.databaseUrl;
        const user = this.configManager.databaseUser;
        const pass = this.configManager.databasePassword;
        console.log('estoy usando esto para conectarme papa',url, user, pass);
        this.driver = Neo4JDriver.driver(url, Neo4JDriver.auth.basic(user, pass));

        return this.driver;
    }
}
