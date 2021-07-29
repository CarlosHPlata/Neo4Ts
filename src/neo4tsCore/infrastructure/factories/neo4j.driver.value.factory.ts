import { Property, PropertyTypes } from '../../core/entities';
import { ParamValueFactory } from '../../core/interfaces/abstract.param.value.factory';
import * as Neo4jDriver from 'neo4j-driver';

export const Neo4jValueFactory: ParamValueFactory = (property: Property) => {
    if (property.value instanceof Date) {
        switch (property.type) {
            case PropertyTypes.DATE:
                return new Neo4jDriver.types.Date(
                    property.value.getFullYear(),
                    property.value.getMonth() + 1,
                    property.value.getDate()
                );

            case PropertyTypes.TIME:
                return new Neo4jDriver.types.Time(
                    property.value.getHours(),
                    property.value.getMinutes(),
                    property.value.getSeconds() * 0,
                    property.value.getMilliseconds() * 1000000,
                    property.value.getTimezoneOffset() * 60
                );

            case PropertyTypes.DATETIME:
            default:
                return new Neo4jDriver.types.DateTime(
                    property.value.getFullYear(),
                    property.value.getMonth() + 1,
                    property.value.getDate(),
                    property.value.getHours(),
                    property.value.getMinutes(),
                    property.value.getSeconds() * 0,
                    property.value.getMilliseconds() * 1000000,
                    property.value.getTimezoneOffset() * 60
                );
        }
    }

    return property.value;
};
