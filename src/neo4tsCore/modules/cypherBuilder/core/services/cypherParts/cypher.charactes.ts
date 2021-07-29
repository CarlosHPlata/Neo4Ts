export type CypherCharacters = { LINE_BREAK: string; TAB_CHAR: string };

export const PRETTY_CHARACTERS: CypherCharacters = {
    LINE_BREAK: '\n',
    TAB_CHAR: '\t',
};

export const MIN_CHARACTERS: CypherCharacters = {
    LINE_BREAK: ' ',
    TAB_CHAR: '',
};

export const RETUNR_KEYWORD: string = 'RETURN';
