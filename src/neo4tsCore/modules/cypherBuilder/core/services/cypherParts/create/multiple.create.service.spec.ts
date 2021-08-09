import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { SelectBuilder } from '../select/select.service';
import { EntitiesCreateBuilder } from './entities.create.builder';
import { MultipleCreateService } from './multiple.create.service';

class MultipleServiceTest extends MultipleCreateService {
    getMatchBuilder(): SelectBuilder {
        return this.matchBuilder;
    }

    getCreateBuilder(): EntitiesCreateBuilder {
        return this.createBuilder;
    }
}

describe('testing create multiple service', () => {
    let createService: MultipleServiceTest;
    let matchBuilder: SelectBuilder;
    let createBuilder: EntitiesCreateBuilder;

    let entities: IGraphEntity[];
    let params: ParamsHolder;

    let matchRes: string;
    let createRes: string;

    const setEntities = (temp: IGraphEntity[]) => {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    };

    beforeEach(() => {
        createService = new MultipleServiceTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        matchBuilder = createService.getMatchBuilder();
        createBuilder = createService.getCreateBuilder();

        jest.spyOn(createBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                createRes = entities.map(e => e.alias).join(' ');
                return createRes;
            }
        );

        jest.spyOn(matchBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                matchRes = entities.map(e => e.alias).join(' ');
                return matchRes;
            }
        );
    });

    test('when sending a node as target it returns the correct targets', () => {
        const node = new Node('test', ['test']);
        node.isTargeteable = true;
        setEntities([node]);

        createService.getCypher(entities, params);
        expect(createRes).toBe('test');
        expect(matchRes).toBe('');
    });

    test('when sending a node no target it returns the correct match', () => {
        const node = new Node('test', ['test']);
        const node2 = new Node('create', ['test']);
        node2.isTargeteable = true;
        setEntities([node, node2]);

        createService.getCypher(entities, params);
        expect(createRes).toBe('create');
        expect(matchRes).toBe('test');
    });

    test('when sending a relationship with one node as target it returns the correct targets', () => {
        const node = new Node('test', ['test']);
        const node2 = new Node('create', ['test']);
        node2.isTargeteable = true;
        const rel = new Relationship('rel', ['REL'], node, node2);
        setEntities([node, node2, rel]);

        createService.getCypher(entities, params);
        expect(createRes).toBe('create rel');
        expect(matchRes).toBe('test');
    });

    test('when no sending targets it should throw an error', () => {
        const node = new Node('test', ['test']);
        setEntities([node]);

        expect.assertions(1);
        try {
            createService.getCypher(entities, params);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'when using multiple create at least one entity should be targeteable'
                )
            );
        }
    });

    test('when sending two nodes target and a relation, relationship should appear just once', () => {
        const node = new Node('test', ['test']);
        node.isTargeteable = true;
        const node2 = new Node('create', ['test']);
        node2.isTargeteable = true;
        const rel = new Relationship('rel', ['REL'], node, node2);
        setEntities([node, node2, rel]);

        createService.getCypher(entities, params);
        expect(createRes).toBe('test create rel');
        expect(matchRes).toBe('');
    });
});
