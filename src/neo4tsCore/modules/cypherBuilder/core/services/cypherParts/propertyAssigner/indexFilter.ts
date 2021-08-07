import { Property } from '../../../../../../core/entities';
import { filterConditionFactory } from './filterCondition.factory';

export const createIndexFilter = (indexProperty: Property): string => {
    const dbalias: string = `id(${indexProperty.alias})`;
    const value: string = getIdValue(indexProperty.value);

    return filterConditionFactory(indexProperty, dbalias, value);
};

const getIdValue = (value: any): string => {
    if (typeof value === 'number') return value + '';
    if (typeof value === 'string') return `'${value}'`;

    throw new Error(
        'error when trying to access id while creating filters, id has an invalid type'
    );
};
