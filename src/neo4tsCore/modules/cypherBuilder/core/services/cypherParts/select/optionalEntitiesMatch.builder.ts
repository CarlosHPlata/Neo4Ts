import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';
import { WhereServiceBuilder } from '../where';
import { EntitiesMatchBuiler } from './entitiesMatch.builder';

export class OptionalEntitiesMatchBuilder extends EntitiesMatchBuiler {
    protected PREFIX_EMPTY = 'OPTIONAL MATCH ';
    protected PREFIX_NON_EMPTY = 'OPTIONAL MATCH ';
    protected PATTERN_BREAK = '';
    protected QUERY_PREFIX = '';

    protected whereService: WhereServiceBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.whereService = new WhereServiceBuilder(lineBreak, tabChar);
    }

    protected getEmptyPrefix() {
        return this.LINE_BREAK + this.PREFIX_EMPTY;
    }

    protected getNonEmptyPrefix() {
        return this.PREFIX_NON_EMPTY;
    }

    protected buildNodeMatch(node: Node): string {
        const wherePart: string = this.getWherePart([node]);
        const query: string = super.buildNodeMatch(node);

        if (query && wherePart) return query + this.LINE_BREAK + wherePart;
        return query;
    }

    protected buildRelMatch(rel: Relationship): string {
        const entities: IGraphEntity[] = [rel];
        if (!this.usedNodes.some(n => n === rel.target))
            entities.push(rel.target);
        if (!this.usedNodes.some(n => n === rel.source))
            entities.push(rel.source);

        const wherePart: string = this.getWherePart(entities);

        const query: string = super.buildRelMatch(rel);

        if (query && wherePart) return query + this.LINE_BREAK + wherePart;
        return query;
    }

    private getWherePart(entities: IGraphEntity[]): string {
        let where: string = this.whereService.getCypher(entities, this.params);
        return where;
    }
}
