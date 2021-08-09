import { IGraphEntity } from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesDeleteBuilder } from './entities.delete.builder';

export class DeleteService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected deleteBuilder: EntitiesDeleteBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.deleteBuilder = new EntitiesDeleteBuilder(lineBreak, tabChar);
    }

    protected buildCypher(target: IGraphEntity): string {
        const matchEntities = this.getMatchEntities(target);
        const matchPart = this.matchBuilder.getCypher(
            matchEntities,
            this.params
        );

        const deletePart = this.deleteBuilder.getCypher([target], this.params);

        return this.prepareQueryString(matchPart + deletePart);
    }

    private getMatchEntities(target: IGraphEntity): IGraphEntity[] {
        const filtered = this.entities.filter(e => e !== target);
        return [...filtered, target];
    }
}
