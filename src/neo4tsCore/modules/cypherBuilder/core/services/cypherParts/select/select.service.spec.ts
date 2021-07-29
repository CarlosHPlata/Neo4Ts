import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { MIN_CHARACTERS } from '../cypher.charactes';
import { WhereServiceBuilder } from '../where';
import { EntitiesMatchBuiler } from './entitiesMatch.builder';
import { OptionalEntitiesMatchBuilder } from './optionalEntitiesMatch.builder';
import { SelectBuilder } from './select.service';

class EntitiesMatchBuilerTest extends EntitiesMatchBuiler {
    getCypher(
        entities: IGraphEntity[],
        params: ParamsHolder,
        usedEntities: Node[]
    ): string {
        if (params) params.addParammeters(entities);
        this.usedNodes = usedEntities.concat(
            entities.filter(n => n instanceof Node) as Node[]
        );

        const res = {
            entities: entities.map(e => e.alias),
            used: this.usedNodes.map(e => e.alias),
        };

        return JSON.stringify(res) + '*';
    }
}

const getObjResult = (builder: SelectBuilderTest) => (
    entities: IGraphEntity[]
) => {
    const params: ParamsHolder = new ParamsHolder();
    params.addParammeters(entities);
    const [normalRes, optionalRes] = builder
        .getCypher(entities, params)
        .split('*');
    return {
        normalRes: JSON.parse(normalRes),
        optionalRes: JSON.parse(optionalRes),
    };
};

class WhereBuilderTest extends WhereServiceBuilder {
    getWhere(): string {
        return '';
    }
}

class SelectBuilderTest extends SelectBuilder {
    constructor() {
        super(MIN_CHARACTERS.LINE_BREAK, MIN_CHARACTERS.TAB_CHAR);
        this.matchBuilder = new EntitiesMatchBuilerTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
        this.optionalMatchBuilder = (new EntitiesMatchBuilerTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        ) as unknown) as OptionalEntitiesMatchBuilder;
        this.whereBuilder = new WhereBuilderTest(
            MIN_CHARACTERS.LINE_BREAK,
            MIN_CHARACTERS.TAB_CHAR
        );
    }
}

describe('testing select builder', () => {
    describe('testing non optional things', () => {
        let entities: IGraphEntity[];
        let builder: SelectBuilderTest;
        let parser: (entities: IGraphEntity[]) => any;
        let params: ParamsHolder;

        beforeEach(() => {
            entities = [new Node('test', ['label'])];
            builder = new SelectBuilderTest();
            params = new ParamsHolder();
            params.addParammeters(entities);
            parser = getObjResult(builder);
        });

        test('when sending a single node it generates the match', () => {
            const res: any = parser(entities).normalRes;

            expect(res.entities.length).toBeGreaterThan(0);
            expect(res.entities[0]).toBe('test');
            expect(res.used.length).toBeGreaterThan(0);
            expect(res.used[0]).toBe('test');
        });

        test('when sending a optional node it generates the match', () => {
            entities[0].isOptional = true;
            const res: any = parser(entities).optionalRes;

            expect(res.entities.length).toBeGreaterThan(0);
            expect(res.entities[0]).toBe('test');
            expect(res.used.length).toBeGreaterThan(0);
            expect(res.used[0]).toBe('test');
        });

        test('when sending two nodes one optional and other non optional it respects', () => {
            entities = [new Node('non', ['test']), new Node('opt', ['test'])];
            entities[1].isOptional = true;

            const res: any = parser(entities);
            expect(res.normalRes.entities.length).toBeGreaterThan(0);
            expect(res.optionalRes.entities.length).toBeGreaterThan(0);
            expect(res.optionalRes.used.length).toBe(2);
            expect(res.optionalRes.used[0]).toBe('non');
            expect(res.optionalRes.used[1]).toBe('opt');
        });
    });
});
