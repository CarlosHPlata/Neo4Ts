import { IGraphEntity } from '../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../core/entities/neoEntities/node.entity';
import { RetrieveBuilder } from './retrieve.builder';
import * as Neo4JDriver from 'neo4j-driver';

class RetrieveBuilderTest extends RetrieveBuilder {
    constructor(entities: IGraphEntity[]) {
        super(entities, {
            run: async () => ({} as Neo4JDriver.QueryResult),
        });
    }
}

describe('test retrieve builder', () => {
    let retrieveBuilder: RetrieveBuilder;
    let entities: IGraphEntity[];

    beforeEach(() => {
        entities = [new Node('test', ['test'])];
        retrieveBuilder = new RetrieveBuilderTest(entities);
    });

    test('when sending a node it returns a query', () => {
        const query: string = retrieveBuilder.getQuery();
        expect(query).toBe('MATCH (test:test) RETURN test');
    });

    test('when sending page and limit it gets generated', () => {
        retrieveBuilder.page = 1;
        retrieveBuilder.size = 10;

        expect(retrieveBuilder.getQuery()).toBe(
            'MATCH (test:test) RETURN test SKIP 10 LIMIT 10'
        );
    });
});
