import {
    FilterValid,
    IGraphEntity,
    Node,
    Property,
    PropertyTypes,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { UpdateService } from './update.service';

class ParamsHolderTest extends ParamsHolder {
    protected generateParamName(property: Property): string {
        return property.alias;
    }
}
describe('testing update service', () => {
    let service: UpdateService;
    let entities: IGraphEntity[];
    let params: ParamsHolder;
    let node: Node;

    function setEntities(temp: IGraphEntity[]) {
        entities = temp;
        params = new ParamsHolderTest();
        params.addParammeters(entities);
    }

    beforeEach(() => {
        service = new UpdateService(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        node = new Node('test', ['test']);
        node.id = 1;
        node.properties = [new Property('prop', PropertyTypes.STRING, 'test')];

        setEntities([node]);
    });

    test('when sending a single entitie as target it returns the correct update cypher', () => {
        const query: string = service.getCypher(entities, params, node);

        expect(query).toBe(
            'MATCH (test:test) WHERE id(test) = 1 SET test.prop = $prop '
        );
    });

    test('when sending more entities it does the update correctly', () => {
        const node2 = new Node('other', ['test']);
        entities.push(node2, new Relationship('rel', ['rel'], node, node2));
        setEntities(entities);

        const query: string = service.getCypher(entities, params, node);
        expect(query).toBe(
            'MATCH (test:test)-[rel:rel]->(other:test) WHERE id(test) = 1 SET test.prop = $prop '
        );
    });

    test('when sending an entities with more properties', () => {
        node.properties.push(
            new Property('prop2', PropertyTypes.STRING, 'test2')
        );
        setEntities(entities);

        const query: string = service.getCypher(entities, params, node);
        expect(query).toBe(
            'MATCH (test:test) WHERE id(test) = 1 SET test.prop = $prop, test.prop2 = $prop2 '
        );
    });

    test('when sending properties as filters it returns the right cypher', () => {
        const prop = new Property('prop2', PropertyTypes.STRING, 'test2');
        prop.isFilter = FilterValid.TRUE;

        node.id = undefined;
        node.properties.push(prop);
        setEntities(entities);

        const query: string = service.getCypher(entities, params, node);
        expect(query).toBe(
            'MATCH (test:test) WHERE test.prop2 = $prop2 SET test.prop = $prop '
        );
    });
});
