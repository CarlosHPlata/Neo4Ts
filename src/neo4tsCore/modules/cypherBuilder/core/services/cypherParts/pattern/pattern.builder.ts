import { Node, Relationship } from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { InnerGenerator } from './inner.builder';
import * as SelectUtils from './select.utils';

export abstract class PatternBuilder extends CypherBuilder {
    protected usedNodes: Node[] = [];

    protected PREFIX_EMPTY = ',';
    protected PREFIX_NON_EMPTY = '';
    protected PATTERN_BREAK = ',';
    protected QUERY_PREFIX = '';

    protected innerFn: InnerGenerator = () => '';

    getUsedNode(): Node[] {
        return this.usedNodes;
    }

    protected buildCypher(usedNodes: Node[] = []): string {
        this.usedNodes = usedNodes;
        const [
            nodesMatch,
            relsMatch,
        ] = this.getNodesAndRelationshipsPatternString();

        let query = this.prepareQuery(nodesMatch, relsMatch);
        query = this.attachQueryPrefix(query);

        return query;
    }

    protected abstract getNodesAndRelationshipsPatternString(): [
        string,
        string
    ];

    protected patternWithRelationshipFirst(): [string, string] {
        const rels: Relationship[] = this.getRelationships();
        const nodes: Node[] = this.getNodes();

        const relsMatch = this.buildRelsMatch(rels);
        const nodesMatch = this.buildNodesMatch(nodes);

        return [nodesMatch, relsMatch];
    }

    protected patternWithNodesFirst(): [string, string] {
        const rels: Relationship[] = this.getRelationships();
        const nodes: Node[] = this.getNodes();

        const nodesMatch = this.buildNodesMatch(nodes);
        const relsMatch = this.buildRelsMatch(rels);

        return [nodesMatch, relsMatch];
    }

    private getRelationships(): Relationship[] {
        return this.entities.filter(
            e => e instanceof Relationship
        ) as Relationship[];
    }

    private getNodes(): Node[] {
        return this.entities.filter(e => e instanceof Node) as Node[];
    }

    private buildRelsMatch(relationships: Relationship[]): string {
        let relsMatch: string = '';

        for (const rel of relationships) {
            let prefix =
                relsMatch !== ''
                    ? this.getEmptyPrefix()
                    : this.getNonEmptyPrefix();
            relsMatch += prefix + this.buildRelMatch(rel);
        }

        return relsMatch;
    }

    protected buildRelMatch(rel: Relationship): string {
        const sourceString = SelectUtils.buildNodePattern(
            rel.source,
            this.usedNodes,
            this.innerFn
        );
        const targetString = SelectUtils.buildNodePattern(
            rel.target,
            this.usedNodes,
            this.innerFn
        );
        const relString = SelectUtils.buildRelPattern(rel, this.innerFn);

        let relsMatch = `${sourceString}-${relString}->${targetString}`;

        return relsMatch;
    }

    private buildNodesMatch(nodes: Node[]): string {
        let nodesMatch: string = '';

        for (const node of nodes) {
            if (!this.usedNodes.some(n => n === node)) {
                let prefix =
                    nodesMatch !== ''
                        ? this.getEmptyPrefix()
                        : this.getNonEmptyPrefix();
                nodesMatch += prefix + this.buildNodeMatch(node);
            }
        }

        return nodesMatch;
    }

    protected buildNodeMatch(node: Node): string {
        const nodeString = SelectUtils.buildNodePattern(
            node,
            this.usedNodes,
            this.innerFn
        );
        let nodeMatch = nodeString;

        return nodeMatch;
    }

    private prepareQuery(nodesMatch: string, relsMatch: string): string {
        let query: string = nodesMatch;

        if (nodesMatch && relsMatch) {
            query += this.PATTERN_BREAK + this.LINE_BREAK;
        }

        query += relsMatch;
        return query;
    }

    protected getEmptyPrefix() {
        return this.PREFIX_EMPTY + this.LINE_BREAK + this.TAB_CHAR;
    }

    protected getNonEmptyPrefix() {
        return this.PREFIX_NON_EMPTY + this.TAB_CHAR;
    }

    protected attachQueryPrefix(query: string): string {
        if (!query) return '';
        if (this.QUERY_PREFIX === '') return query;

        return this.QUERY_PREFIX + this.LINE_BREAK + query;
    }
}
