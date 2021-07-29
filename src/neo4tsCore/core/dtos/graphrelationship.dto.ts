import { GraphEntity } from './graphentity.dto';

export type GraphRelationship = GraphEntity & {
    source?: string;
    from?: string;
    target?: string;
    to?: string;
};
