import { GraphEntity } from './graphentity.dto';
import { GraphRelationship } from './graphrelationship.dto';

export type GraphAbstraction = Record<string, GraphEntity | GraphRelationship>;
