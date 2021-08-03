import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';

export const buildNodeSelect = (node: Node, usedNodes: Node[]): string => {
    const found = usedNodes.find(n => n === node);
    const alias = node.alias || '';

    if (found) {
        return `(${alias})`;
    }

    usedNodes.push(node);
    const labels = node.labels.length > 0 ? `:${node.labels.join(':')}` : '';

    return `(${alias}${labels})`;
};

export const buildRelSelect = (relationship: Relationship): string => {
    const alias = relationship.alias || '';
    const labels =
        relationship.labels.length > 0
            ? `:${relationship.labels.join(':')}`
            : '';

    return `[${alias}${labels}]`;
};
