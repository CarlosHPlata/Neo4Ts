import { ConfigurationManager } from './core/entities/configManager';

export type Configuration = {
    databaseUrl: string;
    databaseUser: string;
    databasePassword: string;
};

/**
 * Set the configuration for Neo4TS to connec to to the DB using the Neo4J Driver
 * @param {Configuration} configuration
 */
export const setConfiguration = (configuration: Configuration): void => {
    const manager: ConfigurationManager = ConfigurationManager.getInstance();
    manager.setConfiguration(configuration);
};

/**
 * Get the configuration used for Neo4TS
 * @returns {ConfigurationManager}
 */
export const getConfiguration = (): ConfigurationManager => {
    return ConfigurationManager.getInstance();
};
