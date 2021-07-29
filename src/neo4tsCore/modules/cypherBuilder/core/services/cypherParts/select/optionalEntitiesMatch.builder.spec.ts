import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import {
    Property,
    PropertyTypes,
} from '../../../../../../core/entities/neoEntities/property.entity';
import { Relationship } from '../../../../../../core/entities/neoEntities/relationship.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { WhereServiceBuilder } from '../where';
import { OptionalEntitiesMatchBuilder } from './optionalEntitiesMatch.builder';

class WhereBuilder extends WhereServiceBuilder {
    getCypher(entities: IGraphEntity[]): string {
        entities = entities.filter(e => e.properties && e.properties.length);
        if (entities.length > 0) {
            let props: string[] = [];
            entities.forEach(entity => {
                let entProps = entity.properties || [];
                props = props.concat(entProps.map(p => p.alias));
            });

            return props.join('-');
        }

        return '';
    }
}

class OptionalEntitiesMatchBuilderTest extends OptionalEntitiesMatchBuilder {
    constructor() {
        super(MIN_CHARACTERS.LINE_BREAK, MIN_CHARACTERS.TAB_CHAR);
        this.whereService = new WhereBuilder(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
    }

    getWhereBuilder(): WhereServiceBuilder {
        return this.whereService;
    }
}

describe('testing optional match builder', () => {
    let optionalBuilder: OptionalEntitiesMatchBuilderTest;
    let entities: IGraphEntity[];
    let params: ParamsHolder;

    beforeEach(() => {
        entities = [new Node('test', ['label'])];
        optionalBuilder = new OptionalEntitiesMatchBuilderTest();
        params = new ParamsHolder();
        params.addParammeters(entities);
    });

    test('when sending a single node it returns the correct cypher', () => {
        const query: string = optionalBuilder.getCypher(entities, params);

        expect(query).toBe('OPTIONAL MATCH (test:label) ');
    });

    test('when sending a single relationship it returns the correct cypher', () => {
        const node1 = new Node('a', ['a']);
        const node2 = new Node('b', ['b']);

        entities = [
            node1,
            node2,
            new Relationship('rel', ['REL'], node1, node2),
        ];
        params.addParammeters(entities);

        const query: string = optionalBuilder.getCypher(entities, params);

        expect(query).toBe('OPTIONAL MATCH (a:a)-[rel:REL]->(b:b) ');
    });

    test('when sending a node with a relationship and several nodes it returns the correct query', () => {
        const node1 = new Node('node1', ['test1']);
        const node2 = new Node('node2', ['test2']);
        const node3 = new Node('node3', ['test3']);
        const node4 = new Node('node4', ['test4']);
        const rel = new Relationship('rel', ['REL'], node1, node2);

        entities = [node1, node2, node3, node4, rel];
        params.addParammeters(entities);

        const query: string = optionalBuilder.getCypher(entities, params);
        const expected =
            'OPTIONAL MATCH (node3:test3) OPTIONAL MATCH (node4:test4) OPTIONAL MATCH (node1:test1)-[rel:REL]->(node2:test2) ';

        expect(query).toBe(expected);
    });

    test('when sending a node with properties filters it should filter after the match', () => {
        const node = new Node('test', ['label']);
        node.properties = [new Property('prop', PropertyTypes.STRING, 'hello')];
        entities = [node];
        params.addParammeters(entities);

        const query: string = optionalBuilder.getCypher(entities, params);
        expect(query).toBe('OPTIONAL MATCH (test:label) prop ');
    });

    test('when sending a relationship with properties it should add the filters after match', () => {
        const node1 = new Node('a', ['a']);
        const node2 = new Node('b', ['b']);
        const rel = new Relationship('rel', ['REL'], node1, node2);
        rel.properties = [new Property('prop', PropertyTypes.STRING, 'hello')];
        entities = [node1, node2, rel];
        params.addParammeters(entities);

        const query: string = optionalBuilder.getCypher(entities, params);
        expect(query).toBe('OPTIONAL MATCH (a:a)-[rel:REL]->(b:b) prop ');
    });

    test('when a node is already used it should only use one filter', () => {
        const node1 = new Node('a', ['a']);
        const node2 = new Node('b', ['b']);
        const rel = new Relationship('rel', ['REL'], node1, node2);
        const rel2 = new Relationship('rel2', ['REL'], node1, node2);
        node1.properties = [
            new Property('prop', PropertyTypes.STRING, 'hello'),
        ];
        entities = [node1, node2, rel, rel2];
        params.addParammeters(entities);

        const query: string = optionalBuilder.getCypher(entities, params);
        expect(query).toBe(
            'OPTIONAL MATCH (a:a)-[rel:REL]->(b:b) prop OPTIONAL MATCH (a)-[rel2:REL]->(b) '
        );
    });
});
