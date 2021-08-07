import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { DeleteService } from './delete.service';

describe('testing delete service', () => {
    let service: DeleteService;
    let entities: IGraphEntity[];
    let params: ParamsHolder;
    let node: Node;

    function setEntities(temp: IGraphEntity[]) {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    }

    beforeEach(() => {
        service = new DeleteService(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        node = new Node('test', ['test']);
        setEntities([node]);
    });

    test('when sending node it should delete it', () => {
        const query: string = service.getCypher(entities, params, node);

        expect(query).toBe('MATCH (test:test) DETACH DELETE test ');
    });

    test('when sending a relationship it should delete it', () => {
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node, node2);
        setEntities([node, node2, rel]);

        const query: string = service.getCypher(entities, params, rel);
        expect(query).toBe(
            'MATCH (test:test)-[rel:rel]->(test2:test) DELETE rel '
        );
    });
});
