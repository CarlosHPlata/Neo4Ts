import { Operator } from '../../entities/neoEntities/property.entity';

export const OperatorFactory = (value: string): Operator => {
    switch (value.toLowerCase()) {
        case 'and':
            return Operator.AND;

        case 'or':
            return Operator.OR;

        case 'xor':
            return Operator.XOR;

        case 'not':
            return Operator.NOT;

        default:
            return Operator.AND;
    }
};
