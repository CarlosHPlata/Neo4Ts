import {IGraphEntity} from "../../../../../../core/entities/neoEntities/graph.entity";
import {Node} from "../../../../../../core/entities/neoEntities/node.entity";
import {EntitiesMatchBuiler} from "./entitiesMatch.builder";
import {OptionalEntitiesMatchBuilder} from "./optionalEntitiesMatch.builder";
import {makeBuildSelect} from "./select.service";

class EntitiesMatchBuilerTest extends EntitiesMatchBuiler {
    build(entities: IGraphEntity[], usedEntities: Node[]): string {
        this.usedNodes = usedEntities.concat(entities.filter(n => n instanceof Node) as Node[]);

        const res = {
            entities: entities.map(e => e.alias),
            used: this.usedNodes.map(e => e.alias),
        };

        return JSON.stringify(res)+'*';
    }
}

const getObjResult = 
    (builder: (entities: IGraphEntity[])=>string) => 
    (entities: IGraphEntity[]) => 
{
    const [ normalRes, optionalRes ] = builder(entities).split('*');
    return {normalRes: JSON.parse(normalRes), optionalRes: JSON.parse(optionalRes)};
};

describe('testing select builder', () => {

    describe('testing non optional things', () => {
        let entities: IGraphEntity[];
        let builder: (entities: IGraphEntity[]) => string;
        let parser: (entities: IGraphEntity[]) => any;

        beforeEach(() => {
            entities = [new Node('test',['label'])];
            builder = makeBuildSelect(new EntitiesMatchBuilerTest(), new EntitiesMatchBuilerTest() as OptionalEntitiesMatchBuilder);
            parser = getObjResult(builder);
        });
        
        test('when sending a single node it generates the match', () => {
            const res: any = parser(entities).normalRes;

            expect(res.entities.length).toBeGreaterThan(0);
            expect(res.entities[0]).toBe('test')
            expect(res.used.length).toBeGreaterThan(0);
            expect(res.used[0]).toBe('test');
        });

        test('when sending a optional node it generates the match', () => {
            entities[0].isOptional = true;
            const res: any = parser(entities).optionalRes;

            expect(res.entities.length).toBeGreaterThan(0);
            expect(res.entities[0]).toBe('test')
            expect(res.used.length).toBeGreaterThan(0);
            expect(res.used[0]).toBe('test');
        });

        test('when sending two nodes one optional and other non optional it respects', () => {
            entities = [
                new Node('non', ['test']),
                new Node('opt', ['test'])
            ];
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
