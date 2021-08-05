import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';
import { InnerGenerator } from './inner.builder';
import { buildNodePattern, buildRelPattern } from './select.utils';

const fakeFn: InnerGenerator = () => '';
describe('testing select utils', () => {
    describe('testing build node select', () => {
        test('when sending a node it should return the node', () => {
            const node: Node = new Node('test', ['label']);
            const query: string = buildNodePattern(node, [], fakeFn);

            expect(query).toBe('(test:label)');
        });

        test('when sending a node that is already used it will only retrieve the node', () => {
            const node: Node = new Node('test', ['label']);
            const query: string = buildNodePattern(node, [node], fakeFn);

            expect(query).toBe('(test)');
        });

        test('when a node does not have labels it should be removed from the query', () => {
            const node: Node = new Node('test', []);
            const query: string = buildNodePattern(node, [], fakeFn);

            expect(query).toBe('(test)');
        });

        test('when sending a inner function it should retrieve the inner part correctly', () => {
            const node: Node = new Node('test', ['label']);
            const query: string = buildNodePattern(node, [], () => 'testing');

            expect(query).toBe('(test:label testing)');
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
            const query: string = buildRelPattern(relationship, fakeFn);

            expect(query).toBe('[rel:REL]');
        });

        test('when a relationship doesn not have labels they are removed', () => {
            relationship.labels = [];
            const query: string = buildRelPattern(relationship, fakeFn);

            expect(query).toBe('[rel]');
        });

        test('when sending a inner function it should retrieve the inner part correctly', () => {
            const query: string = buildRelPattern(
                relationship,
                () => 'testing'
            );

            expect(query).toBe('[rel:REL testing]');
        });
    });
});
