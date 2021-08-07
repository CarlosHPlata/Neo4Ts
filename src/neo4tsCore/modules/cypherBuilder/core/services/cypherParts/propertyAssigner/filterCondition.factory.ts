import {
    Condition,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities/neoEntities/property.entity';

export const filterConditionFactory = (
    property: Property,
    propertyName: string,
    paramValue: string
): string => {
    switch (property.condition) {
        case Condition.DIFFERENT:
            return `${propertyName} <> ${paramValue}`;

        case Condition.CONTAINS:
            if (property.type !== PropertyTypes.STRING) {
                throw new Error(
                    'Contains is an operator only available on strings'
                );
            }
            return `toLower(${propertyName}) CONTAINS ${paramValue}`;

        case Condition.NOTCONTAINS:
            if (property.type !== PropertyTypes.STRING) {
                throw new Error(
                    'Contains is an operator only available on strings'
                );
            }
            return `(not ( toLower(${propertyName}) CONTAINS toLower(${paramValue}) ))`;

        case Condition.STARTS:
            if (property.type !== PropertyTypes.STRING) {
                throw new Error(
                    'Contains is an operator only available on strings'
                );
            }
            return `toLower(${propertyName}) STARTS WITH toLower(${paramValue})`;

        case Condition.ENDS:
            if (property.type !== PropertyTypes.STRING) {
                throw new Error(
                    'Contains is an operator only available on strings'
                );
            }
            return `toLower(${propertyName}) ENDS WITH toLower(${paramValue})`;

        case Condition.GREATER:
            if (
                property.type !== PropertyTypes.INTEGER &&
                property.type !== PropertyTypes.FLOAT
            ) {
                throw new Error(
                    'Greater is an operator only available on numeric types'
                );
            }
            return `${propertyName} > ${paramValue}`;

        case Condition.GREATEREQUAL:
            if (
                property.type !== PropertyTypes.INTEGER &&
                property.type !== PropertyTypes.FLOAT &&
                property.type !== PropertyTypes.DATE &&
                property.type !== PropertyTypes.TIME &&
                property.type !== PropertyTypes.DATETIME
            ) {
                throw new Error(
                    'Greater or Equal (>=) is an operator only available on numeric or date types'
                );
            }
            return `${propertyName} >= ${paramValue}`;

        case Condition.LOWER:
            if (
                property.type !== PropertyTypes.INTEGER &&
                property.type !== PropertyTypes.FLOAT
            ) {
                throw new Error(
                    'LOWER is an operator only available on numeric types'
                );
            }
            return `${propertyName} < ${paramValue}`;

        case Condition.LOWEREQUAL:
            if (
                property.type !== PropertyTypes.INTEGER &&
                property.type !== PropertyTypes.FLOAT &&
                property.type !== PropertyTypes.DATE &&
                property.type !== PropertyTypes.TIME &&
                property.type !== PropertyTypes.DATETIME
            ) {
                throw new Error(
                    'Lower or Equal (<=) is an operator only available on numeric or date types'
                );
            }
            return `${propertyName} <= ${paramValue}`;

        case Condition.IN:
            return `${paramValue} IN ${propertyName}`;

        case Condition.REVERSEIN:
            return `${propertyName} IN ${paramValue}`;

        case Condition.EQUAL:
        default:
            return `${propertyName} = ${paramValue}`;
    }
};
