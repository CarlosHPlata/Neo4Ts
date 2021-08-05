import { GraphAbstraction } from '../../dtos/graph.abstraction.dto';
import { GraphEntity } from '../../dtos/graphentity.dto';
import { GraphRelationship } from '../../dtos/graphrelationship.dto';
import { IGraphEntity } from '../../entities/neoEntities/graph.entity';
import { Node } from '../../entities/neoEntities/node.entity';
import { Relationship } from '../../entities/neoEntities/relationship.entity';
import * as EntityUtils from './entity.utils';
import { validateGraphEntity } from './entity.validator';
import { NodeMapper } from './node.mapper';
import { RelationshipMapper } from './relationship.mapper';

export type AliasedGraph = [string, GraphRelationship | GraphEntity];
export type AliasedNode = [string, GraphEntity];
export type AliasedRelationship = [string, GraphRelationship];

export class EntityMapper {
    protected entitiescreated: IGraphEntity[];
    protected nodeMapper: NodeMapper;
    protected relationshipMapper: RelationshipMapper;

    constructor() {
        this.nodeMapper = new NodeMapper();
        this.relationshipMapper = new RelationshipMapper();
        this.entitiescreated = [];
    }

    getEntitiesFromDtoArray(inputDtos: GraphAbstraction): IGraphEntity[] {
        this.entitiescreated = [];

        const [
            nodesGraphs,
            relationshipGraphs,
        ] = this.getArrayOfGraphAbstraction(inputDtos);

        for (let dto of nodesGraphs) {
            let entity: Node = this.getInputNode(dto);
            if (!this.isEntitieAlreadyCreated(entity)) {
                this.entitiescreated.push(entity);
            }
        }

        for (let dto of relationshipGraphs) {
            let entity: Relationship = this.getInputRelationship(dto);
            if (!this.isEntitieAlreadyCreated(entity)) {
                this.entitiescreated.push(entity);
            }
        }

        return this.entitiescreated;
    }

    private isEntitieAlreadyCreated(entity: IGraphEntity): boolean {
        return this.entitiescreated.some(
            e => (entity.id && e.id === entity.id) || e.alias === entity.alias
        );
    }

    private getArrayOfGraphAbstraction(
        inputDtos: GraphAbstraction
    ): [AliasedNode[], AliasedRelationship[]] {
        const aliasedGraph: AliasedGraph[] = Object.entries(inputDtos);

        for (let entity of aliasedGraph) {
            validateGraphEntity(entity[1]);
        }

        const nodesGraphs: AliasedNode[] = aliasedGraph.filter(
            e =>
                !(
                    (e[1] as GraphRelationship).source ||
                    (e[1] as GraphRelationship).from
                ) &&
                !(
                    (e[1] as GraphRelationship).target ||
                    (e[1] as GraphRelationship).to
                )
        ) as AliasedNode[];

        const relationshipGraphs: AliasedRelationship[] = aliasedGraph.filter(
            e =>
                (e[1] as GraphRelationship).source ||
                (e[1] as GraphRelationship).from ||
                (e[1] as GraphRelationship).target ||
                (e[1] as GraphRelationship).to
        ) as AliasedRelationship[];

        return [nodesGraphs, relationshipGraphs];
    }

    private getInputNode([alias, graphNode]: AliasedNode): Node {
        const id: string | number | undefined = EntityUtils.getId(graphNode);
        const found: IGraphEntity | undefined = this.wasEntityCreated(
            alias,
            id
        );

        if (found) return found as Node;
        else return this.nodeMapper.getInputNode([alias, graphNode]);
    }

    private getInputRelationship([
        alias,
        graphRelationship,
    ]: AliasedRelationship): Relationship {
        const id: string | number | undefined = EntityUtils.getId(
            graphRelationship
        );
        const found: IGraphEntity | undefined = this.wasEntityCreated(
            alias,
            id
        );

        if (found) return found as Relationship;
        else
            return this.relationshipMapper.getInputRelationShipWithEntities(
                [alias, graphRelationship],
                this.entitiescreated
            );
    }

    private wasEntityCreated(
        alias: string,
        id: string | number | undefined
    ): IGraphEntity | undefined {
        let found;

        if (id) {
            found = this.entitiescreated.find(e => e.id == id);
        }

        if (!found && alias) {
            found = this.entitiescreated.find(e => e.alias == alias);
        }

        return found;
    }
}
