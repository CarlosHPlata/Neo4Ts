import { GraphEntity } from './graphentity.dto';
import { GraphRelationship } from './graphrelationship.dto';

export type GraphEntitySchema = Omit<
    GraphEntity,
    'id' | 'properties' | 'isTargeteable'
>;
export type GraphRelationshipSchema = Omit<
    GraphRelationship,
    'id' | 'properties' | 'isTargeteable'
>;

export type GraphSchema = Record<
    string,
    GraphEntitySchema | GraphRelationshipSchema
>;
