import { GraphEntity } from '../../dtos/graphentity.dto';
import { GraphRelationship } from '../../dtos/graphrelationship.dto';

export const validateGraphEntity = (
    entity: GraphEntity | GraphRelationship
): boolean => {
    if (entity.label && entity.labels) {
        throw new Error(
            'A graph entity can not have label and labels, just use one'
        );
    }

    return validateGraphRelationship(entity as GraphRelationship);
};

export const validateGraphRelationship = (
    relationship: GraphRelationship
): boolean => {
    const from = relationship.from || relationship.source;
    const to = relationship.to || relationship.target;

    if (!from && !to) return true;

    if (from && !to) {
        throw new Error('Relationship has a source but no target');
    }

    if (!from && to) {
        throw new Error('Relationship has a target but no source');
    }

    return true;
};
