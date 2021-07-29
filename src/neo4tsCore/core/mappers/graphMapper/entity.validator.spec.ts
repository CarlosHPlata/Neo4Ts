import { GraphEntity } from '../../dtos/graphentity.dto';
import { GraphRelationship } from '../../dtos/graphrelationship.dto';
import { validateGraphEntity } from './entity.validator';

describe('testing the entity validator', () => {
    test('when a valid entity enters it returns true', () => {
        const graph: GraphEntity = { id: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when a valid relationship enters it returns true', () => {
        const graph: GraphRelationship = { from: 'test', to: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when an entity using label and labels enter it throws an erroor', () => {
        const graph: GraphEntity = { label: 'test', labels: 'test' };

        expect.assertions(1);
        try {
            validateGraphEntity(graph);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'A graph entity can not have label and labels, just use one'
                )
            );
        }
    });

    test('when an entity is send using from and to', () => {
        const graph: GraphRelationship = { from: 'test', to: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when an entity is send using from and target', () => {
        const graph: GraphRelationship = { from: 'test', target: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when an entity is send using source and target', () => {
        const graph: GraphRelationship = { source: 'test', target: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when an entity is send using source and to', () => {
        const graph: GraphRelationship = { source: 'test', to: 'test' };

        expect(validateGraphEntity(graph)).toBeTruthy();
    });

    test('when an entity is using from but not to it should throws an error', () => {
        const graph: GraphRelationship = { source: 'test' };

        expect.assertions(1);
        try {
            validateGraphEntity(graph);
        } catch (e) {
            expect(e).toEqual(
                new Error('Relationship has a source but no target')
            );
        }
    });

    test('when an entity is using to but not from it should throws an error', () => {
        const graph: GraphRelationship = { to: 'test' };

        expect.assertions(1);
        try {
            validateGraphEntity(graph);
        } catch (e) {
            expect(e).toEqual(
                new Error('Relationship has a target but no source')
            );
        }
    });
});
