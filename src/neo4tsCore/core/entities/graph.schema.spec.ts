import { GraphAbstraction } from '../dtos';
import { GraphSchemaEntity as GraphSchema } from './graph.schema';

describe('testing graph schema', () => {
    let abstraction: GraphAbstraction;

    beforeEach(() => {
        abstraction = {
            node: { label: 'test' },
        };
    });

    describe('testing get Abstraction', () => {

        test('testing when passing a valid abstraction it returns the same', () => {
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction();

            expect(newAbs.node.label).toBe('test');
        });

        test('testing when passing two nodes and only want one it returns a valid abstraction', () => {
            abstraction['node2'] = { label: 'test2' };
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction('node2');

            const entries = Object.entries(newAbs);
            expect(entries.length).toBe(1);
            expect(entries[0][0]).toBe('node2');
            expect(entries[0][1].label).toBe('test2');
        });

        test('testing when requesting more than one node it returns a valid abstraction', () => {
            abstraction['node2'] = { label: 'test2' };
            abstraction['node3'] = { label: 'test3' };
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction(['node2', 'node3']);

            const entries = Object.entries(newAbs);
            expect(entries.length).toBe(2);

            expect(entries[0][0]).toBe('node2');
            expect(entries[0][1].label).toBe('test2');

            expect(entries[1][0]).toBe('node3');
            expect(entries[1][1].label).toBe('test3');
        });

        test('when requesting nodes withRelationships true it returns a valid abstraction', () => {
            abstraction['node2'] = { label: 'test2' };
            abstraction['node3'] = { label: 'test3' };
            abstraction['rel'] = { label: 'rel', from: 'node', to: 'node2' };
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction(['node2', 'node'], true);

            const entries = Object.entries(newAbs);
            expect(entries.length).toBe(3);

            expect(entries[0][0]).toBe('node2');
            expect(entries[0][1].label).toBe('test2');

            expect(entries[1][0]).toBe('node');
            expect(entries[1][1].label).toBe('test');

            expect(entries[2][0]).toBe('rel');
            expect(entries[2][1].label).toBe('rel');
        });

        test('when requesting nodes without withRelationships it returns a valid abstraction with relationships', () => {
            abstraction['node2'] = { label: 'test2' };
            abstraction['node3'] = { label: 'test3' };
            abstraction['rel'] = { label: 'rel', from: 'node', to: 'node2' };
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction(['node2', 'node']);

            const entries = Object.entries(newAbs);
            expect(entries.length).toBe(3);

            expect(entries[0][0]).toBe('node2');
            expect(entries[0][1].label).toBe('test2');

            expect(entries[1][0]).toBe('node');
            expect(entries[1][1].label).toBe('test');

            expect(entries[2][0]).toBe('rel');
            expect(entries[2][1].label).toBe('rel');
        });

        test('when requesting nodes without withRelationships it returns a valid abstraction without relationships', () => {
            abstraction['node2'] = { label: 'test2' };
            abstraction['node3'] = { label: 'test3' };
            abstraction['rel'] = { label: 'rel', from: 'node', to: 'node2' };
            const schema = new GraphSchema(abstraction);
            const newAbs = schema.getAbstraction(['node2', 'node'], false);

            const entries = Object.entries(newAbs);
            expect(entries.length).toBe(2);

            expect(entries[0][0]).toBe('node2');
            expect(entries[0][1].label).toBe('test2');

            expect(entries[1][0]).toBe('node');
            expect(entries[1][1].label).toBe('test');
        });

        test('when requesting two abstractions it does not return same results', () => {
            const schema = new GraphSchema(abstraction);
            const newAbs1 = schema.getAbstraction();
            newAbs1.node.id = 1;

            const newAbs2 = schema.getAbstraction();
            
            expect(newAbs2.node.id).not.toBe(1);
            expect(newAbs2.node.id).toBeUndefined();
        });

    });

    describe('testing getAbstractionOverride', () => {

        test('when sending a new graph abstraction it overrides the things', () => {
            const schema = new GraphSchema(abstraction);
            const abs = schema.getAbstractionOverride({
                node: { label: 'overrided' }
            });

            expect(abs.node).toBeDefined();
            expect(abs.node.label).toBe('overrided');
        });

        test('when sending a new graph abstraction it only adds more props to the original', () => {
            const schema = new GraphSchema(abstraction);
            const abs = schema.getAbstractionOverride({
                node: {properties: {test: 'test'}}
            });

            expect(abs.node).toBeDefined();
            expect(abs.node.label).toBe('test');
            expect(abs.node.properties).toBeDefined();
            expect(abs.node.properties?.test).toBe('test');
        });

        test('when sending a graph abstraction it does not exists it ignores it', () => {
            const schema = new GraphSchema(abstraction);
            const abs = schema.getAbstractionOverride({
                node2: {properties: {test: 'test'}}
            });

            expect(abs.node2).toBeUndefined();
        });

        test('when sending a graph abstraction and filter abstraction it respects them', () => {
            abstraction['node2'] = {label: 'node2'}
            const schema = new GraphSchema(abstraction);
            const abs = schema.getAbstractionOverride({
                node: {properties: {test: 'test'}}
            }, ['node']);

            expect(abs.node2).toBeUndefined();
            expect(abs.node).toBeDefined();
            expect(abs.node.label).toBe('test');
            expect(abs.node.properties).toBeDefined();
            expect(abs.node.properties?.test).toBe('test');
        });

    });
});
