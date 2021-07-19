
const DEFAULT_FILTER_GROUP = 'Neo4TS_Main_Group';

export class Property {
    condition: Condition = Condition.EQUAL;
    operator: Operator = Operator.AND;
    isReturnable: boolean = true;
    isFilter: boolean = true;
    filterGroups: string[] = [DEFAULT_FILTER_GROUP];

    constructor(
        public alias: string,
        public type: PropertyTypes,
        public value: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | Record<string, any>,
    ) {}
}

export enum PropertyTypes {
    INTEGER = 'integer',
    FLOAT = 'float',
    BOOLEAN = 'boolean',
    STRING = 'string',
    DATE = 'date',
    TIME = 'time',
    DATETIME = 'datetime',
    ARRAY = 'array',
}

export enum Condition {
    EQUAL = 'equal',
    DIFFERENT = 'different',
    CONTAINS = 'contains',
    NOTCONTAINS = 'notcontains',
    STARTS = 'starts',
    ENDS = 'ends',
    GREATER = 'greater',
    GREATEREQUAL = 'greaterequal',
    LOWER = 'lower',
    LOWEREQUAL = 'lowerequal',
    IN = 'in',
    REVERSEIN = 'reversein',
}

export enum Operator {
    AND,
    OR,
    XOR,
    NOT
}
