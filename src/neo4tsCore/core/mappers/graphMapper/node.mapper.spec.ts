import { GraphEntity } from '../../dtos/graphentity.dto';
import { Node } from '../../entities/neoEntities/node.entity';
import { NodeMapper } from './node.mapper';

describe('testing the node mapper', () => {
    let nodeMapper: NodeMapper;
    let graphNode: GraphEntity;
    let alias: string;

    beforeEach(() => {
        nodeMapper = new NodeMapper();
        graphNode = {};
        alias = 'node';
    });

    test('when sending a node with no values it returns an empty node', () => {
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result instanceof Node).toBeTruthy();
    });

    test('when sending a node with only id it returns a node with id', () => {
        graphNode.id = 'test';
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.id).toBe('test');
    });

    test('when sending a node with labels it returns a valid node', () => {
        graphNode.label = 'test';
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.alias.length).toBeGreaterThan(0);
        expect(result.labels[0]).toBe('test');
    });

    test('when sending is returnable it returns a valid node', () => {
        graphNode.isReturnable = true;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isReturnable).toBeTruthy();
    });

    test('when sending is returnable false it returns a valid node', () => {
        graphNode.isReturnable = false;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isReturnable).not.toBeTruthy();
    });

    test('when sending is returnable undefined it returns a vlaid node', () => {
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isReturnable).toBeTruthy();
    });

    test('when sending is optional it returns a valid node', () => {
        graphNode.isOptional = true;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isOptional).toBeTruthy();
    });

    test('when sending is optional false it returns a valid node', () => {
        graphNode.isOptional = false;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isOptional).not.toBeTruthy();
    });

    test('when sending is optional undefined it returns a valid node', () => {
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isOptional).not.toBeTruthy();
    });

    test('when sending is targeteable undefined it returns a valid node with value in false', () => {
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isTargeteable).not.toBeTruthy();
    });

    test('when sending is targeteable as true it returns a valid node with the correct value', () => {
        graphNode.isTargeteable = true;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isTargeteable).toBeTruthy();
    });

    test('when sending is targeteable as false it returns a valid node with the correct falsy value', () => {
        graphNode.isTargeteable = false;
        const result: Node = nodeMapper.getInputNode([alias, graphNode]);

        expect(result.isTargeteable).not.toBeTruthy();
    });
});
