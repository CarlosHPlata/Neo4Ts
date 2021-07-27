import {ConfigurationManager} from './core/entities/configManager';

export type Configuration = {databaseUrl: string, databaseUser: string, databasePassword: string};

export const setConfiguration = (configuration: Configuration): void => {
    const manager: ConfigurationManager = ConfigurationManager.getInstance();
    manager.setConfiguration(configuration);
};

export const getConfiguration = (): ConfigurationManager => {
    return ConfigurationManager.getInstance();
};
