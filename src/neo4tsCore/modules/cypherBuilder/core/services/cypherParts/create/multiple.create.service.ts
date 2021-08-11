import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesCreateBuilder } from './entities.create.builder';

export class MultipleCreateService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected createBuilder: EntitiesCreateBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.createBuilder = new EntitiesCreateBuilder(lineBreak, tabChar);
    }

    protected buildCypher(): string {
        let usedNodes: IGraphEntity[] = [];

        const matchEntities: IGraphEntity[] = this.getMatchEntities();
        const matchPart: string = this.matchBuilder.getCypher(
            matchEntities,
            this.params,
            usedNodes
        );
        usedNodes = this.matchBuilder.getUsedNodes();

        const createEntities: IGraphEntity[] = this.getCreateEntities();
        const createPart: string = this.createBuilder.getCypher(
            createEntities,
            this.params,
            usedNodes
        );

        return this.prepareQueryString(matchPart + createPart);
    }

    private getMatchEntities(): IGraphEntity[] {
        const createEntities = this.getCreateEntities();
        return this.entities.filter(e => !createEntities.includes(e));
    }

    private getCreateEntities(): IGraphEntity[] {
        let entities: IGraphEntity[] = this.entities.filter(
            e => e.isTargeteable
        );

        entities
            .filter(e => e instanceof Node)
            .forEach(target => {
                const side: IGraphEntity[] = this.getSideRelationships(
                    target as Node
                );
                entities.push(...side);
            });

        entities = entities.filter((e, pos) => entities.indexOf(e) === pos);

        if (entities.length === 0) {
            throw new Error(
                'when using multiple create at least one entity should be targeteable'
            );
        }

        return entities;
    }

    protected getSideRelationships(target: Node): IGraphEntity[] {
        return this.entities.filter(e => {
            return (
                e instanceof Relationship &&
                !e.isTargeteable &&
                (e.source === target || e.target === target)
            );
        });
    }
}
