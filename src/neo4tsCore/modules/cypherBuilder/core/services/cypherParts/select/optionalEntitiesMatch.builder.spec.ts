import {IGraphEntity} from "../../../../../../core/entities/neoEntities/graph.entity";
import {Node} from "../../../../../../core/entities/neoEntities/node.entity";
import {Relationship} from "../../../../../../core/entities/neoEntities/relationship.entity";
import {OptionalEntitiesMatchBuilder} from "./optionalEntitiesMatch.builder";

class OptionalEntitiesMatchBuilderTest extends OptionalEntitiesMatchBuilder {
    LINE_BREAK = ' ';
    TAB_CHAR = '';
}

describe('testing optional match builder', () => {
    let optionalBuilder: OptionalEntitiesMatchBuilderTest;
    let entities: IGraphEntity[];

    beforeEach(() => {
        entities = [new Node('test', ['label'])];
        optionalBuilder = new OptionalEntitiesMatchBuilderTest();
    });

    test('when sending a single node it returns the correct cypher', () => {
        const query: string = optionalBuilder.build(entities, []);

        expect(query).toBe('OPTIONAL MATCH (test:label)');
    });

    test('when sending a single relationship it returns the correct cypher', () => {
        const node1 = new Node('a', ['a']);
        const node2 = new Node('b', ['b']);
        
        entities = [
            node1,
            node2,
            new Relationship('rel', ['REL'], node1, node2)
        ];

        const query: string = optionalBuilder.build(entities, []);

        expect(query).toBe('OPTIONAL MATCH (a:a)-[rel:REL]->(b:b)');
    });


    test('when sending a node with a relationship and several nodes it returns the correct query', () => {
        const node1 = new Node('node1', ['test1']);
        const node2 = new Node('node2', ['test2']);
        const node3 = new Node('node3', ['test3']);
        const node4 = new Node('node4', ['test4']);
        const rel = new Relationship('rel', ['REL'], node1, node2);

        entities = [
            node1,
            node2,
            node3,
            node4,
            rel
        ];

        const query: string = optionalBuilder.build(entities, []);
        const expected = 'OPTIONAL MATCH (node3:test3) OPTIONAL MATCH (node4:test4) OPTIONAL MATCH (node1:test1)-[rel:REL]->(node2:test2)';

        expect(query).toBe(expected);
    });

});
