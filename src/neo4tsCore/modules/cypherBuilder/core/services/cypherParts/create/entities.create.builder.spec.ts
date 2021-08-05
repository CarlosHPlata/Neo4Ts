import {
    IGraphEntity,
    Node,
    Property,
    PropertyTypes,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { EntitiesCreateBuilder } from './entities.create.builder';

class ParamsHolderTest extends ParamsHolder {
    protected generateParamName(property: Property): string {
        return property.alias;
    }
}

describe('testing create service', () => {
    let service: EntitiesCreateBuilder;
    let entities: IGraphEntity[];
    let params: ParamsHolder;

    beforeEach(() => {
        service = new EntitiesCreateBuilder(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        entities = [new Node('test', ['test'])];
        params = new ParamsHolderTest();
        params.addParammeters(entities);
    });

    test('when sending a node it returns the correct cypher', () => {
        const query: string = service.getCypher(entities, params);

        expect(query).toBe('CREATE (test:test) ');
    });

    test('when sending a relationship it returns the correct cypher', () => {
        const node1 = new Node('test1', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node1, node2);
        entities = [node1, node2, rel];

        const query: string = service.getCypher(entities, params);

        expect(query).toBe(
            'CREATE (test1:test), (test2:test), (test1)-[rel:rel]->(test2) '
        );
    });

    test('when sending a node with properties it add the properties', () => {
        entities[0].properties = [
            new Property('prop', PropertyTypes.STRING, 'test'),
        ];
        params.addParammeters(entities);

        const query: string = service.getCypher(entities, params);

        expect(query).toBe('CREATE (test:test { prop: $prop }) ');
    });

    test('when sending a relationship with properties it add the properties', () => {
        const node1 = new Node('test1', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node1, node2);
        rel.properties = [new Property('prop', PropertyTypes.STRING, 'test')];
        entities = [node1, node2, rel];
        params.addParammeters(entities);

        const query: string = service.getCypher(entities, params);

        expect(query).toBe(
            'CREATE (test1:test), (test2:test), (test1)-[rel:rel { prop: $prop }]->(test2) '
        );
    });

    test('when sending a used node it should not create it', () => {
        const node1 = new Node('test1', ['test']);
        node1.properties = [
            new Property('node1prop', PropertyTypes.STRING, ''),
        ];

        const node2 = new Node('test2', ['test']);
        node2.properties = [
            new Property('node2prop', PropertyTypes.STRING, ''),
        ];

        const rel = new Relationship('rel', ['rel'], node1, node2);
        rel.properties = [new Property('prop', PropertyTypes.STRING, 'test')];

        entities = [node2, rel];
        params.addParammeters(entities);

        const query: string = service.getCypher(entities, params, [node1]);

        expect(query).toBe(
            'CREATE (test2:test { node2prop: $node2prop }), (test1)-[rel:rel { prop: $prop }]->(test2) '
        );
    });

    test('when sending multiple objects with properties it adds the properties once', () => {
        const node1 = new Node('test1', ['test']);
        node1.properties = [
            new Property('node1prop', PropertyTypes.STRING, ''),
        ];

        const node2 = new Node('test2', ['test']);
        node2.properties = [
            new Property('node2prop', PropertyTypes.STRING, ''),
        ];

        const rel = new Relationship('rel', ['rel'], node1, node2);
        rel.properties = [new Property('prop', PropertyTypes.STRING, 'test')];

        entities = [node1, node2, rel];
        params.addParammeters(entities);

        const query: string = service.getCypher(entities, params);

        expect(query).toBe(
            'CREATE (test1:test { node1prop: $node1prop }), (test2:test { node2prop: $node2prop }), (test1)-[rel:rel { prop: $prop }]->(test2) '
        );
    });
});
