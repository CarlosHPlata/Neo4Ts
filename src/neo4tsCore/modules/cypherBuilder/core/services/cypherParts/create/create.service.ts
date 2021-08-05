import {
    IGraphEntity,
    Node,
    Relationship,
} from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesCreateBuilder } from './entities.create.builder';

export class CreateService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected createBuilder: EntitiesCreateBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.createBuilder = new EntitiesCreateBuilder(lineBreak, tabChar);
    }

    protected buildCypher(target: IGraphEntity): string {
        const targets: IGraphEntity[] = this.getTargetEntities(target);
        const matchEntities: IGraphEntity[] = this.getMatchEntities(targets);

        let usedNodes: IGraphEntity[] = [];

        const matchPart: string = this.matchBuilder.getCypher(
            matchEntities,
            this.params,
            usedNodes
        );
        usedNodes = this.matchBuilder.getUsedNodes();

        const selectPart: string = this.createBuilder.getCypher(
            targets,
            this.params,
            usedNodes
        );

        let query: string = matchPart + selectPart;
        query = query !== '' ? query.slice(0, -1) : '';

        return query;
    }

    private getTargetEntities(target: IGraphEntity): IGraphEntity[] {
        let targets: IGraphEntity[] = [target];

        if (target instanceof Node) {
            targets = targets.concat(this.getSideRelationships(target));
        }

        if (!this.areValidTargets(targets)) {
            throw new Error(
                'One of the entities you are trying to create already has an ID'
            );
        }

        return targets;
    }

    private areValidTargets(targets: IGraphEntity[]): boolean {
        return !targets.some(e => e.id != null);
    }

    private getSideRelationships(target: Node): IGraphEntity[] {
        return this.entities.filter(e => {
            return (
                e instanceof Relationship &&
                (e.source === target || e.target === target)
            );
        });
    }

    private getMatchEntities(targets: IGraphEntity[]): IGraphEntity[] {
        return this.entities.filter(e => !targets.includes(e));
    }
}
