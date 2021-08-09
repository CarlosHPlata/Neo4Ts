import { Node } from '../../entities/neoEntities/node.entity';
import { PropertyMapper } from '../propertiesMapper';
import { AliasedNode } from './entity.mapper';
import * as EntityUtils from './entity.utils';

export class NodeMapper {
    protected propertyMapper: PropertyMapper;

    constructor() {
        this.propertyMapper = new PropertyMapper();
    }

    getInputNode([alias, graphNode]: AliasedNode): Node {
        let id: string | number | undefined = EntityUtils.getId(graphNode);
        let labels: string[] = EntityUtils.getLabels(graphNode);

        if (graphNode.isGroup && graphNode.properties) {
            EntityUtils.pushGroupToAllProperties(graphNode.properties, alias);
        }

        let node = new Node(alias, labels);

        node.id = id;
        node.properties = graphNode.properties
            ? this.propertyMapper.getPropertiesFromDto(graphNode.properties)
            : [];
        node.isReturnable =
            graphNode.isReturnable != null ? graphNode.isReturnable : true;
        node.isOptional =
            graphNode.isOptional != null ? graphNode.isOptional : false;
        node.isTargeteable =
            graphNode.isTargeteable != null ? graphNode.isTargeteable : false;

        return node;
    }
}
