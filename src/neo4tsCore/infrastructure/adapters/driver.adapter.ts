import * as Neo4JDriver from 'neo4j-driver';
import { getConfiguration } from '../../modules/configManager/configManager.presenter';
import { ConfigurationManager } from '../../modules/configManager/core/entities/configManager';

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

    /**
     * Check if the Driver connection to DB is open
     * @returns {boolean}
     */
    isDriverOpen(): boolean {
        return this.driver != null;
    }

    /**
     * Open a new Driver connection to DB using the Neo4TS Configuration Manager, data to connect
     * @returns {Neo4JDriver.Driver}
     */
    openNewDriver(): Neo4JDriver.Driver {
        const url = this.configManager.databaseUrl;
        const user = this.configManager.databaseUser;
        const pass = this.configManager.databasePassword;
        this.driver = Neo4JDriver.driver(
            url,
            Neo4JDriver.auth.basic(user, pass)
        );

        return this.driver;
    }

    /**
     * Get a Driver connection, if it's not open it will open a new connection and return it
     * @returns {Neo4JDriver.Driver}
     */
    getDriver(): Neo4JDriver.Driver {
        if (this.driver) {
            return this.driver;
        }

        const driver = this.openNewDriver();
        return driver;
    }

    /**
     * Close the driver connection
     */
    closeDriver(): void {
        if (this.driver) {
            this.driver.close();
            this.driver = null;
        }
    }
}
