import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { EntitiesDeleteBuilder } from './entities.delete.builder';

describe('testing entities delte builder', () => {
    let builder: EntitiesDeleteBuilder;
    let entities: IGraphEntity[];
    let params: ParamsHolder;

    let node: Node;

    function setEntities(temp: IGraphEntity[]) {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    }

    beforeEach(() => {
        builder = new EntitiesDeleteBuilder(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        node = new Node('test', ['test']);
        setEntities([node]);
    });

    test('when sending a single node it should return the right cypher', () => {
        const query: string = builder.getCypher(entities, params);

        expect(query).toBe('DETACH DELETE test ');
    });

    test('when sending a single node with a relationship that has the node as source or target it should return the right cypher ommitting the relationship', () => {
        const node1 = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel1 = new Relationship('rel1', ['test'], node1, node);
        const rel2 = new Relationship('rel2', ['test'], node, node2);
        setEntities([node1, node2, rel1, rel2]);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('DETACH DELETE test, test2 ');
    });

    test('when sending a single relationship it should return the right cypher', () => {
        const rel = new Relationship('rel', ['test'], node, node);
        setEntities([rel]);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('DELETE rel ');
    });

    test('when sending nodes and relationships it should return the right cypher', () => {
        const node1 = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel1 = new Relationship('rel1', ['test'], node1, node);
        const rel2 = new Relationship('rel2', ['test'], node, node2);
        const rel = new Relationship('rel', ['test'], node, node);
        setEntities([node1, node2, rel1, rel2, rel]);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('DETACH DELETE test, test2 DELETE rel ');
    });
});
