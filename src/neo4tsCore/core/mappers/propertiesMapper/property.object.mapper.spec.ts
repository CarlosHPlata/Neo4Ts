import {
    FilterValid,
    Property,
    PropertyTypes,
} from '../../entities/neoEntities/property.entity';
import { PropertyObjectMapper } from './property.object.mapper';

class PropertyObjectMapperTest extends PropertyObjectMapper {}

describe('testing property object mapper', () => {
    let propertyObjMapper: PropertyObjectMapperTest;
    let alias: string;
    let property: any;

    beforeEach(() => {
        propertyObjMapper = new PropertyObjectMapperTest();
        alias = 'test';
        property = { type: 'string', value: 'test' };
    });

    test('sending a obj with type and value will return a valid Property', () => {
        const result: Property = propertyObjMapper.getPropertyIfObject(
            alias,
            property
        );

        expect(result.alias).toBe(alias);
        expect(result.type).toBe(PropertyTypes.STRING);
        expect(result.value).toBe(property.value);
    });

    test('throw error if has type but no value set', () => {
        property = { value: 'test' };

        expect.assertions(1);
        try {
            propertyObjMapper.getPropertyIfObject(alias, property);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    "Can't parse a property causevalue or type is null or undefined"
                )
            );
        }
    });

    test('throw error if has value but no type', () => {
        property = { type: 'string' };

        expect.assertions(1);
        try {
            propertyObjMapper.getPropertyIfObject(alias, property);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    "Can't parse a property causevalue or type is null or undefined"
                )
            );
        }
    });

    //test('when sending a generic object conver it to json', () => {
    //property = {foo: 'bar'};
    //const result: Property = propertyObjMapper.getPropertyIfObject(alias, property);

    //expect(result.type).toBe(PropertyTypes.STRING);
    //expect(result.value).toBe(JSON.stringify(property));
    //});

    describe('testing porperty decorators', () => {
        test('when passing is returnable true it respect the value', () => {
            property.isReturnable = true;
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isReturnable).toBeTruthy();
        });

        test('when passing is returnable false it respect the value', () => {
            property.isReturnable = false;
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isReturnable).not.toBeTruthy();
        });

        test('when not passing is returnable it returns with true', () => {
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isReturnable).toBeTruthy();
        });

        test('when passing is filter true it respect the value', () => {
            property.isFilter = true;
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isFilter).toBe(FilterValid.TRUE);
        });

        test('when passing is filter false it respect the value', () => {
            property.isFilter = false;
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isFilter).toBe(FilterValid.FALSE);
        });

        test('when not passing is filter it returns with unset', () => {
            const result: Property = propertyObjMapper.getPropertyIfObject(
                alias,
                property
            );

            expect(result.isFilter).toBe(FilterValid.UNSET);
        });
    });
});
