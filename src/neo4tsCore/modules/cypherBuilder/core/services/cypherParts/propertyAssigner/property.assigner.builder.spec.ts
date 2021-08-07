import {
    FilterValid,
    IGraphEntity,
    Node,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { PropertyAssignerBuilder } from './property.assigner.builder';

const fakeOpFactory = () => 'and';
const fakeFilterConditionFactory = (property: Property) =>
    `${property.alias} = ${property.value}`;
const fakeIndexCreator = (property: Property) =>
    `id.${property.alias} = ${property.value}`;

class AssignerTest extends PropertyAssignerBuilder {
    protected operatorFactory = fakeOpFactory;
    protected filterAndConditionFactory = fakeFilterConditionFactory;
    protected indexFilterCreator = fakeIndexCreator;
}

describe('testing property assigner', () => {
    let entities: IGraphEntity[];
    let params: ParamsHolder;
    let builder: PropertyAssignerBuilder;
    let node: Node;

    function setEntities(temp: IGraphEntity[]) {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    }

    beforeEach(() => {
        builder = new AssignerTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        node = new Node('test', ['test']);
        node.properties = [new Property('prop', PropertyTypes.STRING, 'test')];
        setEntities([node]);
    });

    test('if entity has id, it ommits the properties', () => {
        node.id = 1;

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe(' id.test = 1 ');
    });

    test('if entity does not have id, it creates the valid filter for props', () => {
        const query: string = builder.getCypher(entities, params);
        expect(query).toBe(' prop = test ');
    });

    test('when property is not selectable it skip the filter', () => {
        node.properties[0].isFilter = FilterValid.FALSE;

        expect(builder.getCypher(entities, params)).toBe('');
    });

    test('when sending more than one property it does the filter correctly', () => {
        node.properties.push(
            new Property('prop2', PropertyTypes.STRING, 'test2')
        );
        setEntities([node]);

        expect(builder.getCypher(entities, params)).toBe(
            ' prop = test and prop2 = test2 '
        );
    });

    test('when sending more than one entity it does the filters correctly', () => {
        node.properties.push(
            new Property('prop2', PropertyTypes.STRING, 'test2')
        );
        const node2 = new Node('test2', ['test']);
        node2.properties = [
            new Property('prop3', PropertyTypes.STRING, 'test3'),
        ];

        const node3 = new Node('test3', ['test']);
        node3.id = 1;

        setEntities([node, node2, node3]);

        const query: string = builder.getCypher(entities, params);
        expect(query).toBe(
            ' prop = test and prop2 = test2 and prop3 = test3 and id.test3 = 1 '
        );
    });
});
