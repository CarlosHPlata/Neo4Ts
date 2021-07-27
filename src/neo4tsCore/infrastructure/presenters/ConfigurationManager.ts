import { DriverAdapter } from '../adapters/driver.adapter';

export {Configuration, setConfiguration, getConfiguration} from '../../modules/configManager/configManager.presenter';
export * from '../../modules/configManager/core/entities/configManager';
export const closeDriver = () => {
	DriverAdapter.getInstance().closeDriver();
};
export const isDriverOpen = (): boolean => {
	return DriverAdapter.getInstance().isDriverOpen();
};