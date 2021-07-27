import {Node} from '../../../../../../core/entities/neoEntities/node.entity';
import {Relationship} from '../../../../../../core/entities/neoEntities/relationship.entity';
import {buildNodeSelect, buildRelSelect} from './select.utils';

describe('testing select utils', () => {

    describe('testing build node select', () => {

        test('when sending a node it should return the node', () => {
            const node: Node = new Node('test', ['label']);
            const query: string = buildNodeSelect(node, []);

            expect(query).toBe('(test:label)');
        });

        test('when sending a node that is already used it will only retrieve the node', () => {
            const node: Node = new Node('test', ['label']);
            const query: string = buildNodeSelect(node, [node]);

            expect(query).toBe('(test)');
        });

        test('when sending a node with an id it should do the inner filter', () => {
            const node: Node = new Node('test', ['label']);
            node.id = 'test';
            const query: string = buildNodeSelect(node, []);

            expect(query).toBe('(test:label {ptSystemNodeId: \'test\'})');
        });

        test('when a node does not have labels it should be removed from the query', () => {
            const node: Node = new Node('test', []);
            const query: string = buildNodeSelect(node, []);

            expect(query).toBe('(test)');
        });

    });

    describe('testing build relationship', () => {
        let relationship: Relationship;

        beforeEach(() => {
            const node1 = new Node('test1', ['test1']);
            const node2 = new Node('test2', ['test2']);
            relationship = new Relationship('rel', ['REL'], node1, node2);
        });

        test('when sneding a relationship it should return a valid query', () => {
            const query: string = buildRelSelect(relationship);

            expect(query).toBe('[rel:REL]');
        });

        test('when a relationship doesn not have labels they are removed', () => {
            relationship.labels = [];
            const query: string = buildRelSelect(relationship);

            expect(query).toBe('[rel]');
        });

    });


});
