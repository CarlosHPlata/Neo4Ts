import { GraphEntity } from '../../dtos/graphentity.dto';
import {
    generateFakeAlias,
    getId,
    getLabels,
    pushGroupToAllProperties,
} from './entity.utils';

describe('testing entity utils', () => {
    describe('testing getId from graph entity', () => {
        test('test when sending an entity with string id it return the correct value', () => {
            const graph: GraphEntity = { id: 'test' };
            const result: string | number | undefined = getId(graph);

            expect(typeof result).toBe('string');
            expect(result).toBe('test');
        });

        test('test when sending an entity with number id it returns the correct value', () => {
            const graph: GraphEntity = { id: 1 };
            const result: string | number | undefined = getId(graph);

            expect(typeof result).toBe('number');
            expect(result).toBe(1);
        });

        test('test when sending an entity without id it returns no value', () => {
            const graph: GraphEntity = {};
            const result: string | number | undefined = getId(graph);

            expect(result).toBeUndefined();
        });
    });

    describe('testing generateFakeAlias', () => {
        test('Getting an alias', () => {
            const result: string = generateFakeAlias();
            expect(typeof result).toBe('string');
        });
    });

    describe('testing get labels', () => {
        test('when passing a single string with label should return a label', () => {
            const graph: GraphEntity = { label: 'test' };

            expect(getLabels(graph)[0]).toBe('test');
        });

        test('when passing a single string with labels should return a label', () => {
            const graph: GraphEntity = { labels: 'test' };

            expect(getLabels(graph)[0]).toBe('test');
        });

        test('when passing a string array with label should return a label', () => {
            const graph: GraphEntity = { label: ['test'] };

            expect(getLabels(graph)[0]).toBe('test');
        });

        test('when passing a single string with labels should return a label', () => {
            const graph: GraphEntity = { labels: ['test'] };

            expect(getLabels(graph)[0]).toBe('test');
        });

        test('when passing an empy graph entity it should return empty array', () => {
            const graph: GraphEntity = {};

            expect(getLabels(graph).length).toBe(0);
        });

        test('when passing both label and labels should throw error', () => {
            const graph: GraphEntity = { label: 'test', labels: 'test' };

            expect.assertions(1);
            try {
                getLabels(graph);
            } catch (e) {
                expect(e).toEqual(
                    new Error(
                        'Two identifiers for labels were found, you should use one of them (label or labels) not both'
                    )
                );
            }
        });
    });

    describe('Testing pushGroupToAllProperties', () => {
        test('when passing a property and a group the property gets that group', () => {
            const properties: Record<string, any> = { prop: {} };
            const group: string = 'test';
            pushGroupToAllProperties(properties, group);

            expect(properties.prop.group).toBeDefined();
            expect(properties.prop.group).toBe('test');
        });

        test('when passing a property with a group, the group gets concatenated', () => {
            const properties: Record<string, any> = {
                prop: { group: 'testg' },
            };
            const group: string = 'group';
            pushGroupToAllProperties(properties, group);

            expect(properties.prop.group).toBe('group.testg');
        });
    });
});
