import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import {
    Operator,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities/neoEntities/property.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { WhereServiceBuilder } from './where.service';

const conditionFactory = (
    property: Property,
    propertyName: string,
    paramValue: string
): string => {
    return `${property.type}.${propertyName} = ${paramValue}`;
};

const operatorFactory = (): string => {
    return 'AND';
};

class ParamsHolderTest extends ParamsHolder {
    protected generateParamName(property: Property): string {
        return property.alias;
    }
}

class WhereServiceBuilderTest extends WhereServiceBuilder {
    constructor() {
        super(MIN_CHARACTERS.LINE_BREAK, MIN_CHARACTERS.TAB_CHAR);
        this.filterAndConditionFactory = conditionFactory;
        this.operatorFactory = operatorFactory;
    }

    setEntities(entities: IGraphEntity[]): void {
        this.entities = entities;
    }

    setParams(params: ParamsHolder): void {
        this.params = params;
    }
}

describe('testing where service', () => {
    let whereService: WhereServiceBuilderTest;
    let entities: IGraphEntity[];
    let params: ParamsHolderTest;
    let node: Node;
    let prop: Property;

    beforeEach(() => {
        node = new Node('test', ['label']);
        prop = new Property('prop', PropertyTypes.STRING, 'hello');
        node.properties = [prop];
        entities = [node];
        params = new ParamsHolderTest();
        params.addParammeters(entities);

        whereService = new WhereServiceBuilderTest();
    });

    test('when sending a node it should return the correct where string', () => {
        const query: string = whereService.getCypher(entities, params);

        expect(query).toBe('WHERE string.test.prop = $prop ');
    });

    test('when a node has more than one property it shouuld generate the string correctly', () => {
        node.properties.push(new Property('prop2', PropertyTypes.INTEGER, 2));
        params.addParammeters(entities);
        const query: string = whereService.getCypher(entities, params);

        expect(query).toBe(
            'WHERE string.test.prop = $prop AND integer.test.prop2 = $prop2 '
        );
    });

    test('when a node has one property but the operator is not and it should fail', () => {
        prop.operator = Operator.OR;

        expect.assertions(1);
        try {
            whereService.getCypher(entities, params);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    "In where filter, the first filte should be always an 'AND' operator"
                )
            );
        }
    });
    test('when sending a node without properties it should return empty string', () => {
        node.properties = [];
        params.addParammeters(entities);
        const query: string = whereService.getCypher(entities, params);

        expect(query).toBe('');
    });

    test('when more than one node is passed it generates the right filter', () => {
        const node1 = new Node('node1', ['node1']);
        node1.properties.push(new Property('prop', PropertyTypes.INTEGER, 2));
        const node2 = new Node('node2', ['node2']);
        node2.properties.push(new Property('prop2', PropertyTypes.INTEGER, 2));
        entities = [node1, node2];
        params.addParammeters(entities);

        expect(whereService.getCypher(entities, params)).toBe(
            'WHERE integer.node1.prop = $prop AND integer.node2.prop2 = $prop2 '
        );
    });

    test('when an entity has an id it will generate the id where and skip the properties', () => {
        node.id = 123;

        expect(whereService.getCypher(entities, params)).toBe(
            'WHERE id(test) = 123 '
        );
    });
});
