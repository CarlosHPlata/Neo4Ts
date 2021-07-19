import {IGraphEntity} from "../../../../../../core/entities/neoEntities/graph.entity";
import {Node} from "../../../../../../core/entities/neoEntities/node.entity";
import {Relationship} from "../../../../../../core/entities/neoEntities/relationship.entity";
import * as SelectUtils from "./select.utils";

export class EntitiesMatchBuiler {
    protected usedNodes: Node[] = [];
    protected TAB_CHAR = '\t';
    protected LINE_BREAK = '\n';

    protected PREFIX_EMPTY = ',' ;
    protected PREFIX_NON_EMPTY = '';
    protected MATCH_BREAK = ',';

    getUsedNode(): Node[] {
        return this.usedNodes;
    }

    build(entities: IGraphEntity[], usedNodes: Node[] = []): string {
        this.usedNodes = usedNodes;

        const rels: Relationship[] = entities.filter(e => e instanceof Relationship) as Relationship[];
        const nodes: Node[] = entities.filter(e => e instanceof Node) as Node[];

        const relsMatch = this.buildRelsMatch(rels);
        const nodesMatch = this.buildNodesMatch(nodes);

        let query = this.prepareQuery(nodesMatch, relsMatch);
        query = this.attachMatch(query).trim();

        return query;
    }
    
    protected buildRelsMatch(relationships: Relationship[]): string {
        let relsMatch: string = '';

        for (const rel of relationships) {
            const sourceString = SelectUtils.buildNodeSelect(rel.source, this.usedNodes);
            const targetString = SelectUtils.buildNodeSelect(rel.target, this.usedNodes);
            const relString = SelectUtils.buildRelSelect(rel);

            let prefix = relsMatch != ''? this.getEmptyPrefix() : this.getNonEmptyPrefix();

            relsMatch += prefix + `${sourceString}-${relString}->${targetString}`;
        }

        return relsMatch;
    }
    
    protected buildNodesMatch(nodes: Node[]): string {
        let nodesMatch: string = '';

        for (const node of nodes) {
            if (!this.usedNodes.some(n => n == node)) {
                const nodeString = SelectUtils.buildNodeSelect(node, this.usedNodes);
                let prefix = nodesMatch != ''? this.getEmptyPrefix(): this.getNonEmptyPrefix();

                nodesMatch += prefix + nodeString;
            }
        }

        return nodesMatch;
    }

    private prepareQuery(nodesMatch: string, relsMatch: string): string {
        let query: string = nodesMatch;

        if (nodesMatch && relsMatch) {
            query += this.MATCH_BREAK + this.LINE_BREAK;
        }

        query += relsMatch;
        return query;
    }

    protected attachMatch(query: string): string {
        if (!query) return '';

        return 'MATCH'+this.LINE_BREAK+query;
    }

    protected getEmptyPrefix() {
        return this.PREFIX_EMPTY + this.LINE_BREAK + this.TAB_CHAR;
    }

    protected getNonEmptyPrefix() {
        return this.PREFIX_NON_EMPTY + this.TAB_CHAR;
    }

}
