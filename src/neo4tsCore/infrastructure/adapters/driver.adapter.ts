import * as Neo4JDriver from 'neo4j-driver';
import {getConfiguration} from '../../modules/configManager/configManager.presenter';
import {ConfigurationManager} from '../../modules/configManager/core/entities/configManager';

export class DriverAdapter {
    private static instance: DriverAdapter;

    private driver: Neo4JDriver.Driver | null;
    private configManager: ConfigurationManager;

    private constructor() {
        this.configManager = getConfiguration();
        this.driver = this.openNewDriver();
    }

    static getInstance(): DriverAdapter {
        if (!DriverAdapter.instance) {
            DriverAdapter.instance = new DriverAdapter();
        }

        return DriverAdapter.instance;
    }

    isDriverOpen(): boolean {
        return this.driver != null;
    }

    openNewDriver(): Neo4JDriver.Driver {
        const url = this.configManager.databaseUrl;
        const user = this.configManager.databaseUser;
        const pass = this.configManager.databasePassword;
        this.driver = Neo4JDriver.driver(url, Neo4JDriver.auth.basic(user, pass));

        return this.driver;
    }

    getDriver(): Neo4JDriver.Driver {
        if (this.driver) {
            return this.driver;
        }
        
        const driver = this.openNewDriver();
        return driver;
    }

    closeDriver(): void {
        if (this.driver) {
            this.driver.close();
            this.driver = null;
        }
    }
}
