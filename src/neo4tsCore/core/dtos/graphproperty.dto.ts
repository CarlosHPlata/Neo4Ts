export type GraphProperty =
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | boolean[]
    | GraphPropertyDefinition
    | Record<string, any>;

export type GraphPropertyDefinition = {
    value:
        | string
        | number
        | boolean
        | string
        | Date
        | string[]
        | number[]
        | boolean[];
    type:
        | 'integer'
        | 'number'
        | 'float'
        | 'boolean'
        | 'string'
        | 'date'
        | 'time'
        | 'datetime'
        | 'array';
    condition?:
        | 'equal'
        | '='
        | 'different'
        | '<>'
        | '!='
        | 'contains'
        | 'not contains'
        | '!contains'
        | 'starts'
        | 'starts with'
        | 'ends'
        | 'ends with'
        | 'greater'
        | '>'
        | 'greaterequal'
        | 'greater equal'
        | 'equalgreater'
        | 'equal greater'
        | '>='
        | 'lower'
        | '<'
        | 'lowerequal'
        | 'lower equal'
        | 'equal lower'
        | 'equal lower'
        | '<='
        | 'in'
        | '!in'
        | 'reversein'
        | 'reverse in';
    operator?: 'and' | 'or' | 'xor' | 'not';
    isReturnable?: boolean;
    group?: string;
    isFilter?: boolean;
};
