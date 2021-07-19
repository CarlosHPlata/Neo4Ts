import {EntitiesMatchBuiler} from "./entitiesMatch.builder";

export class OptionalEntitiesMatchBuilder extends EntitiesMatchBuiler {
    protected PREFIX_EMPTY = 'OPTIONAL MATCH ';
    protected PREFIX_NON_EMPTY = 'OPTIONAL MATCH ';
    protected MATCH_BREAK = '';

    protected attachMatch(query: string): string {
        return query;
    }

    protected getEmptyPrefix() {
        return this.LINE_BREAK + this.PREFIX_EMPTY;
    }

    protected getNonEmptyPrefix() {
        return this.PREFIX_NON_EMPTY;
    }
}
