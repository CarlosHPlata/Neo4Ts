import {
    Operator,
    Property,
} from '../../../../../../core/entities/neoEntities/property.entity';

export const operatorFactory = (property: Property): string => {
    switch (property.operator) {
        case Operator.OR:
            return 'OR';
        case Operator.NOT:
            return 'NOT';
        case Operator.XOR:
            return 'XOR';
        case Operator.AND:
        default:
            return 'AND';
    }
};
