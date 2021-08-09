import { IGraphEntity, Node } from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { SelectBuilder } from '../select/select.service';
import { EntitiesDeleteBuilder } from './entities.delete.builder';
import { MultipleDeleteService } from './multiple.delete.service';

class MultipleDeleteTest extends MultipleDeleteService {
    getMatchBuilder(): SelectBuilder {
        return this.matchBuilder;
    }

    getDeleteBuilder(): EntitiesDeleteBuilder {
        return this.deleteBuilder;
    }
}

describe('testing multiple delete service', () => {
    let deleteService: MultipleDeleteTest;
    let matchBuilder: SelectBuilder;
    let createBuilder: EntitiesDeleteBuilder;

    let entities: IGraphEntity[];
    let params: ParamsHolder;

    let matchRes: string;
    let delRes: string;

    const setEntities = (temp: IGraphEntity[]) => {
        entities = temp;
        params = new ParamsHolder();
        params.addParammeters(entities);
    };

    beforeEach(() => {
        deleteService = new MultipleDeleteTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        matchBuilder = deleteService.getMatchBuilder();
        createBuilder = deleteService.getDeleteBuilder();

        jest.spyOn(createBuilder, 'getCypher').mockImplementation(
            (entities: IGraphEntity[]) => {
                delRes = entities.map(e => e.alias).join(' ');
                return delRes;
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

        deleteService.getCypher(entities, params);
        expect(delRes).toBe('test');
    });

    test('when sending a node for match it return the correct entities', () => {
        const node = new Node('test', ['test']);
        const node2 = new Node('test2', ['test']);
        node2.isTargeteable = true;
        setEntities([node, node2]);

        deleteService.getCypher(entities, params);
        expect(delRes).toBe('test2');
        expect(matchRes).toBe('test test2');
    });
});
