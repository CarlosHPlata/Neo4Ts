import { GraphAbstraction } from '../../dtos/graph.abstraction.dto';
import { IGraphEntity } from '../../entities/neoEntities/graph.entity';
import { Node } from '../../entities/neoEntities/node.entity';
import { Relationship } from '../../entities/neoEntities/relationship.entity';
import { EntityMapper } from './entity.mapper';

class EntityMapperTest extends EntityMapper {
    setEntitiesCreated(entitiescreated: IGraphEntity[]) {
        this.entitiescreated = entitiescreated;
    }
}

describe('testing entity mapper', () => {
    let mapper: EntityMapperTest;

    beforeEach(() => {
        mapper = new EntityMapperTest();
    });

    test('testing it maps correctly a graph', () => {
        const graph: GraphAbstraction = { node: { label: 'test' } };
        const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(graph);

        expect(result.length).toBeGreaterThan(0);
    });

    test('when triggered getEntitiesFromDtoArray it cleans the entities created array', () => {
        mapper.setEntitiesCreated([new Node('prev', ['test'])]);
        const graph: GraphAbstraction = { prev: { label: 'testAfter' } };
        const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(graph);

        expect(result.length).toBe(1);
        expect(result[0].labels[0]).toBe('testAfter');
    });

    describe('testing mapping correctly nodes', () => {
        test('testing single node is created', () => {
            const graph: GraphAbstraction = { node: { label: 'test' } };
            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );

            expect(result[0] instanceof Node).toBeTruthy();

            const node: Node = result[0] as Node;
            expect(node.labels[0]).toBe('test');
        });

        test('more than 1 nodes are created', () => {
            const graph: GraphAbstraction = {
                node1: { id: 'test1' },
                node2: { id: 'test2' },
            };
            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );

            expect(result.length).toBe(2);
            expect(result.some(e => e.id === 'test1')).toBeTruthy();
            expect(result.some(e => e.id === 'test2')).toBeTruthy();
        });

        test('when 2 same nodes are pushed with same id only one is created', () => {
            const graph: GraphAbstraction = {
                node1: { id: 'test' },
                node2: { id: 'test' },
            };
            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );

            expect(result.length).toBe(1);
            expect(result[0].id).toBe('test');
        });
    });

    describe('testing relationship entities creation', () => {
        test('testing single node is created', () => {
            const graph: GraphAbstraction = {
                test: {},
                rel: { id: 'rel', from: 'test', to: 'test' },
            };

            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );
            const rel = result.find(e => e.id === 'rel');

            expect(rel).toBeDefined();
            expect(rel instanceof Relationship).toBeTruthy();
        });

        test('more than 1 relationship are created', () => {
            const graph: GraphAbstraction = {
                node1: { id: 'test1' },
                rel: { id: 'rel', from: 'node1', to: 'test' },
                rel2: { id: 'rel2', from: 'node1', to: 'test' },
            };
            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );

            expect(result.length).toBe(4);
            expect(result.some(e => e.id === 'rel')).toBeTruthy();
            expect(result.some(e => e.id === 'rel2')).toBeTruthy();
        });

        test('when 2 same relationships are pushed with same id only one is created', () => {
            const graph: GraphAbstraction = {
                node1: { id: 'test1' },
                rel: { id: 'rel', from: 'node1', to: 'test' },
                rel2: { id: 'rel', from: 'node1', to: 'test' },
            };
            const result: IGraphEntity[] = mapper.getEntitiesFromDtoArray(
                graph
            );

            expect(result.length).toBe(3);
            expect(result.filter(e => e instanceof Relationship).length).toBe(
                1
            );
        });
    });
});
