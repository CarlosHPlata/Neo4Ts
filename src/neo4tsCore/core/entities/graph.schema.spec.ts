import { GraphAbstraction } from '../dtos';
import { GraphSchemaEntity as GraphSchema } from './graph.schema';

describe('testing graph schema', () => {
    let abstraction: GraphAbstraction;

    beforeEach(() => {
        abstraction = {
            node: { label: 'test' },
        };
    });

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
});
