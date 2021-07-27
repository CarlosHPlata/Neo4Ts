import {Node} from "../../../../../../core/entities/neoEntities/node.entity";
import {Relationship} from "../../../../../../core/entities/neoEntities/relationship.entity";
import {CypherBuilder} from "../cypher.builder";
import * as SelectUtils from "./select.utils";

export class EntitiesMatchBuiler extends CypherBuilder {
    protected usedNodes: Node[] = [];

    protected PREFIX_EMPTY = ',' ;
    protected PREFIX_NON_EMPTY = '';
    protected MATCH_BREAK = ',';


    getUsedNode(): Node[] {
        return this.usedNodes;
    }

    protected buildCypher(usedNodes: Node[] = []): string {
        this.usedNodes = usedNodes;

        const rels: Relationship[] = this.entities.filter(e => e instanceof Relationship) as Relationship[];
        const nodes: Node[] = this.entities.filter(e => e instanceof Node) as Node[];

        const relsMatch = this.buildRelsMatch(rels);
        const nodesMatch = this.buildNodesMatch(nodes);

        let query = this.prepareQuery(nodesMatch, relsMatch);
        query = this.attachMatch(query).trim();

        return query;
    }
    
    private buildRelsMatch(relationships: Relationship[]): string {
        let relsMatch: string = '';

        for (const rel of relationships) {
            let prefix = relsMatch != ''? this.getEmptyPrefix() : this.getNonEmptyPrefix();
            relsMatch += prefix + this.buildRelMatch(rel);
        }

        return relsMatch;
    }

    protected buildRelMatch(rel: Relationship): string {
        const sourceString = SelectUtils.buildNodeSelect(rel.source, this.usedNodes);
        const targetString = SelectUtils.buildNodeSelect(rel.target, this.usedNodes);
        const relString = SelectUtils.buildRelSelect(rel);

        let relsMatch = `${sourceString}-${relString}->${targetString}`;

        return relsMatch;
    }
    
    private buildNodesMatch(nodes: Node[]): string {
        let nodesMatch: string = '';

        for (const node of nodes) {
            if (!this.usedNodes.some(n => n == node)) {
                let prefix = nodesMatch != ''? this.getEmptyPrefix() : this.getNonEmptyPrefix();
                nodesMatch += prefix + this.buildNodeMatch(node);
            }
        }

        return nodesMatch;
    }

    protected buildNodeMatch(node: Node): string {
        const nodeString = SelectUtils.buildNodeSelect(node, this.usedNodes);
        let nodeMatch = nodeString;

        return nodeMatch;
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
