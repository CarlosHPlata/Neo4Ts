import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { EntitiesMatchBuiler } from './entitiesMatch.builder';

describe('testing entities match builder', () => {
    let matchBuilder: EntitiesMatchBuiler;
    let entities: IGraphEntity[];

    beforeEach(() => {
        entities = [new Node('test', ['label'])];
        matchBuilder = new EntitiesMatchBuiler(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
    });

    test('when sending a single node it returns the correct cypher', () => {
        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            []
        );

        expect(query).toBe('MATCH (test:label) ');
    });

    test('when sending a single relationship it returns the correct cypher', () => {
        const nodeA = new Node('a', ['A']);
        const nodeB = new Node('b', ['B']);

        entities = [
            nodeA,
            nodeB,
            new Relationship('rel', ['Rel'], nodeA, nodeB),
        ];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            []
        );

        expect(query).toBe('MATCH (a:A)-[rel:Rel]->(b:B) ');
    });

    test('when sending a node used it should return nothing', () => {
        const node = new Node('node', ['test']);
        entities = [node];
        const used: Node[] = [node];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            used
        );

        expect(query).toBe('');
    });

    test('when sending a node used, on a relationship it should only use the alias', () => {
        const nodeA = new Node('nodeA', ['testA']);
        const nodeB = new Node('nodeB', ['testB']);
        const rel = new Relationship('rel', ['testRel'], nodeA, nodeB);

        const used: Node[] = [nodeA];
        entities = [nodeB, nodeA, rel];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            used
        );

        expect(query).toBe('MATCH (nodeA)-[rel:testRel]->(nodeB:testB) ');
    });

    test('when sending nodes and a relationshio, only the relationship is in the query', () => {
        const nodeA = new Node('nodeA', ['testA']);
        const nodeB = new Node('nodeB', ['testB']);
        const rel = new Relationship('rel', ['testRel'], nodeA, nodeB);

        entities = [nodeB, nodeA, rel];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            []
        );

        expect(query).toBe('MATCH (nodeA:testA)-[rel:testRel]->(nodeB:testB) ');
    });

    test('when sending a node with an id but is already used it will return just the node', () => {
        const nodeA = new Node('nodeA', ['testA']);
        nodeA.id = 'test';
        const nodeB = new Node('nodeB', ['testB']);
        const rel = new Relationship('rel', ['testRel'], nodeA, nodeB);

        entities = [nodeB, nodeA, rel];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            [nodeA]
        );

        expect(query).toBe('MATCH (nodeA)-[rel:testRel]->(nodeB:testB) ');
    });

    test('when sending a node with a relationship and several nodes it returns the correct query', () => {
        const node1 = new Node('node1', ['test1']);
        const node2 = new Node('node2', ['test2']);
        const node3 = new Node('node3', ['test3']);
        const node4 = new Node('node4', ['test4']);
        const rel = new Relationship('rel', ['REL'], node1, node2);

        entities = [node1, node2, node3, node4, rel];

        const query: string = matchBuilder.getCypher(
            entities,
            new ParamsHolder(),
            []
        );

        expect(query).toBe(
            'MATCH (node3:test3), (node4:test4), (node1:test1)-[rel:REL]->(node2:test2) '
        );
    });
});
