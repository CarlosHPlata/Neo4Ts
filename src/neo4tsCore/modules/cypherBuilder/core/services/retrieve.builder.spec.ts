import {IGraphEntity} from "../../../../core/entities/neoEntities/graph.entity";
import {Node} from "../../../../core/entities/neoEntities/node.entity";
import {RetrieveBuilder} from "./retrieve.builder";

class RetrieveBuilderTest extends RetrieveBuilder {
    setBuildSelect(fn: (entities: IGraphEntity[]) => string): void {
        this.buildSelect = fn;
    }

    setEntities(entities: IGraphEntity[]) {
        this.entities = entities;
    }
}

const buildSelect = (entities: IGraphEntity[]) => {return JSON.stringify(entities)};

describe('test retrieve builder', () => {
    let retrieveBuilder: RetrieveBuilderTest;
    let entities: IGraphEntity[];

    beforeEach(() => {
        entities = [new Node('test', ['test'])];
        retrieveBuilder = new RetrieveBuilderTest(entities);
        retrieveBuilder.setBuildSelect(buildSelect);
    });

    test('test that is getting a valid query', () => {
        const query: string = retrieveBuilder.getQuery();

        expect(query).toBe(JSON.stringify(entities));
    });
});
