import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { SelectBuilder } from '../select/select.service';
import { CreateService } from './create.service';
import { EntitiesCreateBuilder } from './entities.create.builder';

class CreateServiceTest extends CreateService {
    getMatchBuilder(): SelectBuilder {
        return this.matchBuilder;
    }

    getCreateBuilder(): EntitiesCreateBuilder {
        return this.createBuilder;
    }
}

describe('testing create service', () => {
    let createService: CreateServiceTest;
    let matchBuilder: SelectBuilder;
    let createBuilder: EntitiesCreateBuilder;

    let entities: IGraphEntity[];
    let params: ParamsHolder;

    const setEntities = (temp: IGraphEntity[]) => {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    };

    beforeEach(() => {
        createService = new CreateServiceTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        matchBuilder = createService.getMatchBuilder();
        createBuilder = createService.getCreateBuilder();
    });

    test('when sending a node it returns the correct targets', () => {
        let res: string = '';
        jest.spyOn(createBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        setEntities([node]);

        createService.getCypher(entities, params, node);
        expect(res).toBe('test');
    });

    test('when sending a node as target with tied relationships all target entities should exist', () => {
        let res: string = '';
        jest.spyOn(createBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node, node2);
        setEntities([node, node2, rel]);

        createService.getCypher(entities, params, node);
        expect(res).toBe('test rel');
    });

    test('when sending a relationship as target it returns the correct target', () => {
        let res: string = '';
        jest.spyOn(createBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node, node2);
        setEntities([node, node2, rel]);

        createService.getCypher(entities, params, rel);
        expect(res).toBe('rel');
    });

    test('when sending an invalid target it should throw an error', () => {
        const node = new Node('test', ['test']);
        node.id = 1;
        setEntities([node]);

        expect.assertions(1);
        try {
            createService.getCypher(entities, params, node);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'One of the entities you are trying to create already has an ID'
                )
            );
        }
    });

    test('when sending an invalid relationship with a valid target it should throw an error', () => {
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node, node2);
        rel.id = 1;

        setEntities([node, node2, rel]);

        expect.assertions(1);
        try {
            createService.getCypher(entities, params, node);
        } catch (e) {
            expect(e).toEqual(
                new Error(
                    'One of the entities you are trying to create already has an ID'
                )
            );
        }
    });

    test('when sending a target it should be removed from the match entities', () => {
        let res: string = '';
        jest.spyOn(matchBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        setEntities([node]);

        createService.getCypher(entities, params, node);
        expect(res).toBe('');
    });

    test('when sending aditional entities they should be present on the match entities', () => {
        let res: string = '';
        jest.spyOn(matchBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        setEntities([node, node2]);

        createService.getCypher(entities, params, node);
        expect(res).toBe('test2');
    });

    test('when sending a node as target with tied relationships all target entities should be removed from match entities', () => {
        let res: string = '';
        jest.spyOn(matchBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                res = entities.map(e => e.alias).join(' ');
                return res;
            }
        );
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        const rel = new Relationship('rel', ['rel'], node, node2);
        setEntities([node, node2, rel]);

        createService.getCypher(entities, params, node);
        expect(res).toBe('test2');
    });
});
