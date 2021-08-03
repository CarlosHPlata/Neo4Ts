import {
    Property,
    PropertyTypes,
} from '../../entities/neoEntities/property.entity';
import { PropertyMapper } from './property.mapper';
import { PropertyObjectMapper } from './property.object.mapper';

class PropertyMapperTest extends PropertyMapper {
    getObjectMapper(): PropertyObjectMapper {
        return this.propertyObjectMapper;
    }
}

describe('testing property mapper', () => {
    let propertyMapper: PropertyMapperTest;
    let properties: Record<string, any>;
    let propertyObjectMapper: PropertyObjectMapper;

    beforeEach(() => {
        properties = { prop: 'test' };
        propertyMapper = new PropertyMapperTest();
        propertyObjectMapper = propertyMapper.getObjectMapper();
    });

    test('passing a property with primitive value is converted to property', () => {
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result.length).toBe(1);
        expect(result[0].value).toBe('test');
    });

    test('passing a date propertie returns a datetime type property', () => {
        const date = new Date();
        properties = { prop: date };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result[0].type).toBe(PropertyTypes.DATETIME);
        expect(result[0].value).toEqual(date);
    });

    test('passing an array property returns a array type property', () => {
        properties = {
            array1: ['string', 'string'],
            array2: [1, 2, 3],
            array3: [true, false],
        };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        const array1Prop: Property | undefined = result.find(
            p => p.alias === 'array1'
        );
        const array2Prop: Property | undefined = result.find(
            p => p.alias === 'array2'
        );
        const array3Prop: Property | undefined = result.find(
            p => p.alias === 'array3'
        );

        expect(array1Prop).toBeDefined();
        expect((array1Prop as Property).type).toBe(PropertyTypes.ARRAY);
        expect((array1Prop as Property).value).toEqual(['string', 'string']);

        expect(array2Prop).toBeDefined();
        expect((array2Prop as Property).type).toBe(PropertyTypes.ARRAY);
        expect((array2Prop as Property).value).toEqual([1, 2, 3]);

        expect(array3Prop).toBeDefined();
        expect((array3Prop as Property).type).toBe(PropertyTypes.ARRAY);
        expect((array3Prop as Property).value).toEqual([true, false]);
    });

    test('passing an array with differente values will throws an error', () => {
        properties = { prop: [1, 'test'] };

        expect.assertions(1);

        try {
            propertyMapper.getPropertiesFromDto(properties);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'Array property not valid, arrays can contains only ONE primitive type'
                )
            );
        }
    });

    test('passing an object as a property will return a valid property', () => {
        properties = { prop: { foo: 'bar' } };
        jest.spyOn(
            propertyObjectMapper,
            'getPropertyIfObject'
        ).mockImplementation(
            () => new Property('prop', PropertyTypes.STRING, 'test')
        );
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result.length).toBe(1);
        expect(result[0].value).toBe('test');
    });

    test('passing a number will return a valid property', () => {
        properties = { prop: 1 };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result[0].type).toBe(PropertyTypes.INTEGER);
        expect(result[0].value).toBe(1);
    });

    test('passing a float number will return a valid property', () => {
        properties = { prop: 1.1 };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result[0].type).toBe(PropertyTypes.FLOAT);
        expect(result[0].value).toBe(1.1);
    });

    test('passing a boolean will return a valid property', () => {
        properties = { prop: true };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result[0].type).toBe(PropertyTypes.BOOLEAN);
        expect(result[0].value).toBe(true);
    });

    test('passing a string will return a valid property', () => {
        properties = { prop: 'string' };
        const result: Property[] = propertyMapper.getPropertiesFromDto(
            properties
        );

        expect(result[0].type).toBe(PropertyTypes.STRING);
        expect(result[0].value).toBe('string');
    });
});
