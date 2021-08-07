import {
    Condition,
    FilterValid,
    IGraphEntity,
    Node,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { EntitiesUpdateBuilder } from './entities.update.builder';

class UpdateBuilderTest extends EntitiesUpdateBuilder {
    protected filterAndConditionFactory = (property: Property) =>
        `${property.alias}: ${property.value}`;
}
describe('testing entities update builder', () => {
    let builder: EntitiesUpdateBuilder;
    let entities: IGraphEntity[];
    let params: ParamsHolder;
    let node: Node;

    function setEntities(temp: IGraphEntity[]) {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    }

    beforeEach(() => {
        builder = new UpdateBuilderTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        node = new Node('test', ['test']);
        node.properties = [new Property('prop', PropertyTypes.STRING, 'test')];
        setEntities([node]);
    });

    test('when sending a node with properties it returns the correct set', () => {
        const query: string = builder.getCypher(entities, params);

        expect(query).toBe('SET prop: test ');
    });

    test('when sending an entitie with filter set true it skip it', () => {
        node.properties[0].isFilter = FilterValid.TRUE;
        setEntities(entities);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('');
    });

    test('when sending an entitie with propertie set true but not equality throw error', () => {
        node.properties[0].condition = Condition.CONTAINS;
        setEntities(entities);

        expect.assertions(1);
        try {
            builder.getCypher(entities, params);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'Error while reading properties for update, property prop has not equality set, if this is a filter mark it with isFilter as true'
                )
            );
        }
    });

    test('if entitie has id still creates the set', () => {
        node.id = 1;
        setEntities(entities);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('SET prop: test ');
    });

    test('when sending multiple properties it respect them', () => {
        node.properties = [
            new Property('test1', PropertyTypes.STRING, 'test1'),
            new Property('test2', PropertyTypes.STRING, 'test2'),
            new Property('test3', PropertyTypes.STRING, 'test3'),
        ];
        node.properties[1].isFilter = FilterValid.TRUE;

        setEntities(entities);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe('SET test1: test1, test3: test3 ');
    });
});
