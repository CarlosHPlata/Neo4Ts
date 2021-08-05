import { IGraphEntity } from '../../../../../../core/entities';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';
import { InnerGenerator } from './inner.builder';

export const buildNodePattern = (
    node: Node,
    usedNodes: Node[],
    innerFn: InnerGenerator
): string => {
    const found = usedNodes.find(n => n === node);
    const alias = node.alias || '';

    if (found) {
        return `(${alias})`;
    }

    usedNodes.push(node);
    const labels = node.labels.length > 0 ? `:${node.labels.join(':')}` : '';
    const inner = getInner(node, innerFn);

    return `(${alias}${labels}${inner})`;
};

export const buildRelPattern = (
    relationship: Relationship,
    innerFn: InnerGenerator
): string => {
    const alias = relationship.alias || '';
    const labels =
        relationship.labels.length > 0
            ? `:${relationship.labels.join(':')}`
            : '';

    const inner = getInner(relationship, innerFn);

    return `[${alias}${labels}${inner}]`;
};

const getInner = (entity: IGraphEntity, innerFn: InnerGenerator): string => {
    const innerPart = innerFn(entity);

    if (innerPart) return ` ${innerPart}`;
    else return '';
};
