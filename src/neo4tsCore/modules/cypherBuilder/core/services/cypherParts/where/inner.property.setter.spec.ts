import {
    IGraphEntity,
    Node,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { InnerPropertySetter } from './inner.property.setter';

class ParamsHolderTest extends ParamsHolder {
    protected generateParamName(property: Property): string {
        return property.alias;
    }
}

describe('testing inner part generator', () => {
    let entities: IGraphEntity[];
    let params: ParamsHolder;
    let service: InnerPropertySetter;

    beforeEach(() => {
        const node = new Node('test', ['test']);
        node.properties = [
            new Property('prop', PropertyTypes.STRING, 'test'),
            new Property('prop2', PropertyTypes.DATE, new Date()),
        ];

        entities = [node];
        params = new ParamsHolderTest();
        params.addParammeters(entities);

        service = new InnerPropertySetter(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
    });

    test('when sending an entity it does treturn the right inner cypher', () => {
        const query: string = service.getCypher(entities, params);

        expect(query).toBe('{ prop: $prop, prop2: $prop2 } ');
    });

    test('when sending and entity without propertis it returns empty string', () => {
        entities = [new Node('noprops', ['test'])];
        params.addParammeters(entities);

        const query: string = service.getCypher(entities, params);

        expect(query).toBe('');
    });
});
