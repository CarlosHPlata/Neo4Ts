import { DriverAdapter } from '../adapters/driver.adapter';

export {
    Configuration,
    setConfiguration,
    getConfiguration,
} from '../../modules/configManager/configManager.presenter';
export * from '../../modules/configManager/core/entities/configManager';

/**
 * Close the driver connection
 */
export const closeDriver = () => {
    DriverAdapter.getInstance().closeDriver();
};

/**
 * Check if the Driver connection to DB is open
 * @returns {boolean}
 */
export const isDriverOpen = (): boolean => {
    return DriverAdapter.getInstance().isDriverOpen();
};
