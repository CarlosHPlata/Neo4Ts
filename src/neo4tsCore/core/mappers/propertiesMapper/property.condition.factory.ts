import { Condition } from '../../entities/neoEntities/property.entity';

export const PropertyConditionFactory = (value: string): Condition => {
    switch (value.toLowerCase()) {
        case 'equal':
        case '=':
            return Condition.EQUAL;

        case 'different':
        case '<>':
        case '!=':
            return Condition.DIFFERENT;

        case 'contains':
            return Condition.CONTAINS;

        case 'not contains':
        case 'notcontains':
        case '!contains':
            return Condition.NOTCONTAINS;

        case 'starts':
        case 'starts with':
            return Condition.STARTS;

        case 'ends':
        case 'ends with':
            return Condition.ENDS;

        case 'greater':
        case '>':
            return Condition.GREATER;

        case 'greaterequal':
        case 'greater equal':
        case 'equalgreater':
        case 'equal greater':
        case '>=':
            return Condition.GREATEREQUAL;

        case 'lower':
        case '<':
            return Condition.LOWER;

        case 'lowerequal':
        case 'lower equal':
        case 'equallower':
        case 'equal lower':
        case '<=':
            return Condition.LOWEREQUAL;

        case 'in':
            return Condition.IN;

        case '!in':
        case 'reversein':
        case 'reverse in':
            return Condition.REVERSEIN;

        default:
            throw new Error('the operator you provide is not supported');
    }
};
