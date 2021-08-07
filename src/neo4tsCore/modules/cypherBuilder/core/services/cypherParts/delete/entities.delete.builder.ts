import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';

export class EntitiesDeleteBuilder extends CypherBuilder {
    protected DELETE_PREFIX = 'DELETE';
    protected DELETE_EXTRA_NODE_REL_PREFIX = 'DETACH';

    protected buildCypher(): string {
        const nodesDelete = this.generateDeleteForNodes();
        const relsDelete = this.generateDeleteForRelationships();

        const cypher = `${nodesDelete}${
            nodesDelete && relsDelete ? this.LINE_BREAK : ''
        }${relsDelete}`;
        return cypher;
    }

    private generateDeleteForNodes(): string {
        const prefix =
            this.DELETE_EXTRA_NODE_REL_PREFIX + ' ' + this.DELETE_PREFIX;
        const entities: Node[] = this.getNodes();

        return this.generateDeleteCypherForentities(entities, prefix);
    }

    private generateDeleteForRelationships(): string {
        const prefix = this.DELETE_PREFIX;
        const entities: Relationship[] = this.getIsolatedRels();

        return this.generateDeleteCypherForentities(entities, prefix);
    }

    private generateDeleteCypherForentities(
        entites: IGraphEntity[],
        prefix: string
    ): string {
        let coreQuery = '';

        for (const entity of entites) {
            coreQuery += `${entity.alias}, `;
        }

        if (coreQuery) {
            coreQuery = coreQuery.slice(0, -2);
            return prefix + this.LINE_BREAK + coreQuery;
        }

        return '';
    }

    private getNodes(): Node[] {
        return this.entities.filter(e => e instanceof Node) as Node[];
    }

    private getIsolatedRels(): Relationship[] {
        const nodes: Node[] = this.getNodes();
        return this.entities.filter(
            e =>
                e instanceof Relationship &&
                !(nodes.includes(e.source) || nodes.includes(e.target))
        ) as Relationship[];
    }
}
