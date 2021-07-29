import { GraphPropertyDefinition } from '../../dtos/graphproperty.dto';
import {
    Property,
    PropertyTypes,
} from '../../entities/neoEntities/property.entity';
import { validateOneTypeArray } from './property.utils';

export const PropertyTypeValueFactory = (
    alias: string,
    dbprop: GraphPropertyDefinition
): Property => {
    let prop: Property;

    switch (dbprop.type) {
        case 'integer':
            prop = new Property(
                alias,
                PropertyTypes.INTEGER,
                parseInt(dbprop.value as string)
            );
            break;
        case 'number':
        case 'float':
            prop = new Property(
                alias,
                PropertyTypes.INTEGER,
                parseFloat(dbprop.value as string)
            );
            break;
        case 'boolean':
            switch (typeof dbprop.value) {
                case 'string':
                    prop = new Property(
                        alias,
                        PropertyTypes.BOOLEAN,
                        dbprop.value.toLowerCase() === 'true'
                    );
                    break;
                case 'number':
                    prop = new Property(
                        alias,
                        PropertyTypes.BOOLEAN,
                        dbprop.value === 1
                    );
                    break;
                case 'boolean':
                    prop = new Property(
                        alias,
                        PropertyTypes.BOOLEAN,
                        dbprop.value
                    );
                    break;
                default:
                    throw new Error(
                        'Error in Query Service: Cannot parse value with the type defined'
                    );
            }
            break;
        case 'string':
            prop = new Property(alias, PropertyTypes.STRING, dbprop.value + '');
            break;
        case 'date':
            if (dbprop.value instanceof Date) {
                prop = new Property(alias, PropertyTypes.DATE, dbprop.value);
            } else
                throw Error(
                    'Error in Query Service: Cannot parse value with the type defined'
                );
            break;
        case 'datetime':
            if (dbprop.value instanceof Date) {
                prop = new Property(
                    alias,
                    PropertyTypes.DATETIME,
                    dbprop.value
                );
            } else
                throw Error(
                    'Error in Query Service: Cannot parse value with the type defined'
                );
            break;
        case 'time':
            if (dbprop.value instanceof Date) {
                prop = new Property(alias, PropertyTypes.TIME, dbprop.value);
            } else
                throw Error(
                    'Error in Query Service: Cannot parse value with the type defined'
                );
            break;
        case 'array':
            if (
                Array.isArray(dbprop.value) &&
                validateOneTypeArray(dbprop.value)
            ) {
                prop = new Property(alias, PropertyTypes.ARRAY, dbprop.value);
            } else
                throw Error(
                    'Error in Query Service: Cannot parse value with the type defined'
                );
            break;
        default:
            throw new Error();
    }

    return prop;
};
