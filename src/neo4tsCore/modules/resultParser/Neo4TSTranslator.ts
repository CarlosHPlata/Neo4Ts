import * as Neo4JDriver from 'neo4j-driver';
import {
    GraphAbstraction,
    GraphEntity,
    GraphRelationship,
} from '../../core/dtos';
import { IGraphEntity, Node, Relationship } from '../../core/entities';
import { getValue } from './GenericTranslator';

export const mapToDto = (
    map: Neo4JDriver.QueryResult,
    originalPattern: IGraphEntity[]
): GraphAbstraction[] => {
    const finalRes: GraphAbstraction[] = [];

    for (const record of map.records) {
        finalRes.push(mapEntities(record, originalPattern));
    }

    return finalRes;
};

const mapEntities = (
    record: Neo4JDriver.Record,
    originalPattern: IGraphEntity[]
): GraphAbstraction => {
    const abstraction: GraphAbstraction = {};
    const onlyReturnables = originalPattern.filter(e => e.isReturnable);

    for (const entity of onlyReturnables) {
        const resultEnt = record.get(entity.alias);
        if (resultEnt)
            abstraction[entity.alias] = mapGraphEntities(resultEnt, entity);
    }

    return abstraction;
};

const mapGraphEntities = (
    recordValue: any,
    originalEntity: IGraphEntity
): GraphEntity | GraphRelationship => {
    if (isNode(recordValue) && originalEntity instanceof Node) {
        return mapGraphEntityFromRecord(recordValue);
    } else if (
        isRelationship(recordValue) &&
        originalEntity instanceof Relationship
    ) {
        return mapGraphRelationshipFromRecord(recordValue, originalEntity);
    }

    throw new Error("DB results don't match the pattern defined");
};

const isNode = (recordValue: any) =>
    recordValue.hasOwnProperty('identity') &&
    recordValue.hasOwnProperty('properties') &&
    recordValue.hasOwnProperty('labels');

const isRelationship = (recordValue: any) =>
    recordValue.hasOwnProperty('identity') &&
    recordValue.hasOwnProperty('properties') &&
    recordValue.hasOwnProperty('start') &&
    recordValue.hasOwnProperty('end') &&
    recordValue.hasOwnProperty('type');

const mapGraphEntityFromRecord = (
    recordNode: Neo4JDriver.Node
): GraphEntity => {
    const graphent: GraphEntity = {
        id: getId(recordNode),
        labels: recordNode.labels,
        properties: mapGraphProperties(recordNode),
    };

    return graphent;
};

const mapGraphRelationshipFromRecord = (
    recordRelationship: Neo4JDriver.Relationship,
    originalRel: Relationship
): GraphRelationship => {
    const graphRel: GraphRelationship = {
        id: getId(recordRelationship),
        labels: [recordRelationship.type],
        from: originalRel.source.alias,
        to: originalRel.target.alias,
        properties: mapGraphProperties(recordRelationship),
    };

    return graphRel;
};

const getId = (
    recordValue: Neo4JDriver.Node | Neo4JDriver.Relationship
): number | string => {
    const identity = recordValue.identity;
    let id: string | number;

    if (
        Neo4JDriver.isInt(identity) &&
        Neo4JDriver.integer.inSafeRange(identity)
    ) {
        id = Neo4JDriver.int(identity).toNumber();
    } else {
        id = identity.toString();
    }

    return id;
};

const mapGraphProperties = (
    recordValue: Neo4JDriver.Node | Neo4JDriver.Relationship
): Record<string, any> => {
    let props: Record<string, any> = {};

    if (
        recordValue.properties &&
        typeof recordValue.properties === 'object' &&
        Object.keys(recordValue.properties).length > 0
    ) {
        const keys = Object.keys(recordValue.properties);
        for (const key of keys) {
            props[key] = getValue(recordValue.properties[key]);
        }
    }

    return props;
};
