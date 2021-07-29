export class ConfigurationManager {
    private static instance: ConfigurationManager;

    databaseUrl: string = '';
    databaseUser: string = '';
    databasePassword: string = '';

    private constructor() {}

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }

        return ConfigurationManager.instance;
    }

    setConfiguration({
        databaseUrl,
        databaseUser,
        databasePassword,
    }: {
        databaseUrl: string;
        databaseUser: string;
        databasePassword: string;
    }): void {
        this.databaseUrl = databaseUrl;
        this.databaseUser = databaseUser;
        this.databasePassword = databasePassword;
    }
}
