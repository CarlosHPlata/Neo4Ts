import { Property, PropertyTypes } from '../../core/entities';
import { Neo4jValueFactory } from './neo4j.driver.value.factory';
import * as Neo4jDriver from 'neo4j-driver';

describe('testing the factory', () => {
    test('when sending a primitive value it returns the same', () => {
        const prop: Property = new Property(
            'prop',
            PropertyTypes.STRING,
            'test'
        );
        expect(Neo4jValueFactory(prop)).toBe('test');
    });

    test('when sending a date it should return a neo4j date', () => {
        const prop: Property = new Property(
            'prop',
            PropertyTypes.DATE,
            new Date()
        );
        expect(
            Neo4jValueFactory(prop) instanceof Neo4jDriver.types.Date
        ).toBeTruthy();
    });

    test('when sending a time it should return a neo4j time', () => {
        const prop: Property = new Property(
            'prop',
            PropertyTypes.TIME,
            new Date()
        );
        expect(
            Neo4jValueFactory(prop) instanceof Neo4jDriver.types.Time
        ).toBeTruthy();
    });

    test('when sending a date time it should return a neo4j date time', () => {
        const prop: Property = new Property(
            'prop',
            PropertyTypes.DATETIME,
            new Date()
        );
        expect(
            Neo4jValueFactory(prop) instanceof Neo4jDriver.types.DateTime
        ).toBeTruthy();
    });
});
