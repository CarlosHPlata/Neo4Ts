import { GraphAbstraction } from '../dtos';
import { GraphSchema } from '../dtos/graph.schema.dto';
import { GraphSchemaEntity } from '../entities/graph.schema';

export class SchemaService {
    createSchema(schema: GraphSchema): GraphSchemaEntity {
        return new GraphSchemaEntity(schema as GraphAbstraction);
    }
}
