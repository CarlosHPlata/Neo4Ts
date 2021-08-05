import { CreateBuilder } from './create.builder';
import * as Neo4JDriver from 'neo4j-driver';
import { IGraphEntity, Node, Relationship } from '../../../../core/entities';

describe('testing create builder service', () => {
    let target: IGraphEntity;
    let entities: IGraphEntity[];

    function setTarget(temp: IGraphEntity) {
        target = temp;
        entities = [target];
    }

    const initBuilder = (): CreateBuilder => {
        return new CreateBuilder(entities, target, {
            run: async () => ({} as Neo4JDriver.QueryResult),
        });
    };

    beforeEach(() => {
        setTarget(new Node('test', ['test']));
    });

    test('when sending a node it returns a query', () => {
        const query: string = initBuilder().getQuery();
        expect(query).toBe('CREATE (test:test) RETURN test');
    });

    test('when sending a relationship it should create the query', () => {
        const node1 = new Node('node1', ['test']);
        const node2 = new Node('node2', ['test']);
        const rel = new Relationship('rel', ['REL'], node1, node2);
        setTarget(rel);
        entities.push(node1, node2);

        const query: string = initBuilder().getQuery();
        expect(query).toBe(
            'MATCH (node1:test), (node2:test) CREATE (node1)-[rel:REL]->(node2) RETURN rel, node1, node2'
        );
    });
});
