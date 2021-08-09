import { GraphRelationship } from '../../dtos/graphrelationship.dto';
import { IGraphEntity } from '../../entities/neoEntities/graph.entity';
import { Node } from '../../entities/neoEntities/node.entity';
import { Relationship } from '../../entities/neoEntities/relationship.entity';
import { RelationshipMapper } from './relationship.mapper';

describe('testing relationship mapper', () => {
    let relationshipMapper: RelationshipMapper;
    let relationship: GraphRelationship;
    let entitiesCreated: IGraphEntity[];
    let alias: string;

    beforeEach(() => {
        relationshipMapper = new RelationshipMapper();
        entitiesCreated = [new Node('test1', []), new Node('test2', [])];
        relationship = { from: 'test1', to: 'test2' };
        alias = 'rel';
    });

    test('when sending an empty relationship it returns a valid response', () => {
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result).toBeDefined();
    });

    test('when sending a relationship with an id it returns a valid result', () => {
        relationship.id = 'test';
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.id).toBe('test');
    });

    test('when sending a relationship with label it returns a valid result', () => {
        relationship.label = 'test';
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.labels.length).toBe(1);
        expect(result.labels[0]).toBe('test');
    });

    test('when sending isOptional it returns a valid relationship', () => {
        relationship.isOptional = true;
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isOptional).toBeTruthy();
    });

    test('when sending isOptional it returns a valid relationship', () => {
        relationship.isOptional = false;
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isOptional).not.toBeTruthy();
    });

    test('when sending isOptional undefined it returns a valid relationship', () => {
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isOptional).not.toBeTruthy();
    });

    test('when sending isReturnable it returns a valid relationship', () => {
        relationship.isReturnable = true;
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isReturnable).toBeTruthy();
    });

    test('when sending isReturnable it returns a valid relationship', () => {
        relationship.isReturnable = false;
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isReturnable).not.toBeTruthy();
    });

    test('when sending a is targeteable undefined it sets it to false', () => {
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isTargeteable).not.toBeTruthy();
    });

    test('when sending is targeteable it returns a valid relationship', () => {
        relationship.isTargeteable = true;
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isTargeteable).toBeTruthy();
    });

    test('when sending isReturnable undefined it returns a valid relationship', () => {
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.isReturnable).toBeTruthy();
    });

    test('when sending target unknow it creates an empty Node', () => {
        relationship.to = 'unknow';
        relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(entitiesCreated.length).toBe(3);
        expect(
            entitiesCreated.some(e => e instanceof Node && e.alias === 'unknow')
        ).toBeTruthy();
    });

    test('when sending source unknow it creates an empty Node', () => {
        relationship.from = 'unknow';
        relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(entitiesCreated.length).toBe(3);
        expect(
            entitiesCreated.some(e => e instanceof Node && e.alias === 'unknow')
        ).toBeTruthy();
    });

    test('it accepts source and target instead of from to', () => {
        relationship = { source: 'test1', target: 'test2' };
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.source.alias).toBe('test1');
        expect(result.target.alias).toBe('test2');
    });

    test('it accepts from and to instead of source target', () => {
        relationship = { from: 'test1', to: 'test2' };
        const result: Relationship = relationshipMapper.getInputRelationShipWithEntities(
            [alias, relationship],
            entitiesCreated
        );

        expect(result.source.alias).toBe('test1');
        expect(result.target.alias).toBe('test2');
    });

    test('when passing unknown source and target it throws an error', () => {
        relationship = { from: 'unknow', to: 'unknow' };

        expect.assertions(1);
        try {
            relationshipMapper.getInputRelationShipWithEntities(
                [alias, relationship],
                entitiesCreated
            );
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'at least one of the relationship nodes (source or target) must exists in dtos list'
                )
            );
        }
    });
});
