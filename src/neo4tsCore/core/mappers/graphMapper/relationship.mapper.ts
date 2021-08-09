import { GraphRelationship } from '../../dtos/graphrelationship.dto';
import { IGraphEntity } from '../../entities/neoEntities/graph.entity';
import { Node } from '../../entities/neoEntities/node.entity';
import { Relationship } from '../../entities/neoEntities/relationship.entity';
import { PropertyMapper } from '../propertiesMapper';
import { AliasedRelationship } from './entity.mapper';
import * as EntityUtils from './entity.utils';

export class RelationshipMapper {
    private entitiescreated: IGraphEntity[] = [];
    protected propertyMapper: PropertyMapper;

    constructor() {
        this.propertyMapper = new PropertyMapper();
    }

    getInputRelationShipWithEntities(
        aliasedRel: AliasedRelationship,
        entitiescreated: IGraphEntity[]
    ): Relationship {
        this.entitiescreated = entitiescreated;
        return this.getInputRelationship(aliasedRel);
    }

    private getInputRelationship([
        alias,
        graphRepationship,
    ]: AliasedRelationship): Relationship {
        const id: string | number | undefined = EntityUtils.getId(
            graphRepationship
        );
        const labels: string[] = EntityUtils.getLabels(graphRepationship);

        if (graphRepationship.isGroup && graphRepationship.properties) {
            EntityUtils.pushGroupToAllProperties(
                graphRepationship.properties,
                alias
            );
        }

        const [source, target] = this.getSourceAndTarget(graphRepationship);

        let relationship: Relationship = new Relationship(
            alias,
            labels,
            source,
            target
        );
        relationship.id = id;
        relationship.properties = graphRepationship.properties
            ? this.propertyMapper.getPropertiesFromDto(
                  graphRepationship.properties
              )
            : [];
        relationship.isOptional =
            graphRepationship.isOptional != null
                ? graphRepationship.isOptional
                : false;
        relationship.isReturnable =
            graphRepationship.isReturnable != null
                ? graphRepationship.isReturnable
                : true;
        relationship.isTargeteable = 
            graphRepationship.isTargeteable != null
                ? graphRepationship.isTargeteable
                : false;

        return relationship;
    }

    private getSourceAndTarget(
        graphRepationship: GraphRelationship
    ): [Node, Node] {
        let source: Node = this.entitiescreated.find(
            n =>
                n.alias === graphRepationship.from ||
                n.alias === graphRepationship.source
        ) as Node;

        let target: Node = this.entitiescreated.find(
            n =>
                n.alias === graphRepationship.to ||
                n.alias === graphRepationship.target
        ) as Node;

        const isOptional =
            graphRepationship.isOptional != null
                ? graphRepationship.isOptional
                : false;

        if (!source && !target) {
            throw new Error(
                'at least one of the relationship nodes (source or target) must exists in dtos list'
            );
        } else {
            if (!source) {
                const aliasSource: string =
                    graphRepationship.source || graphRepationship.from || '';
                source = this.buildStringNode(aliasSource, isOptional);
            }

            if (!target) {
                const aliasTarget: string =
                    graphRepationship.target || graphRepationship.to || '';
                target = this.buildStringNode(aliasTarget, isOptional);
            }
        }

        return [source, target];
    }

    private buildStringNode(aliasNode: string, isOptional: boolean) {
        let node: Node = new Node(aliasNode, []);
        this.entitiescreated.push(node);

        node.isOptional = isOptional;

        return node;
    }
}
