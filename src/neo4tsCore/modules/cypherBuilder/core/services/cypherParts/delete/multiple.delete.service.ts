import { IGraphEntity } from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesDeleteBuilder } from './entities.delete.builder';

export class MultipleDeleteService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected deleteBuilder: EntitiesDeleteBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.deleteBuilder = new EntitiesDeleteBuilder(lineBreak, tabChar);
    }

    protected buildCypher(): string {
        const matchPart: string = this.getMatchParts();
        const deletePart: string = this.getDeletePart();

        return this.prepareQueryString(matchPart + deletePart);
    }

    private getMatchParts(): string {
        return this.matchBuilder.getCypher(this.entities, this.params);
    }

    private getDeletePart(): string {
        const entities: IGraphEntity[] = this.getTargetEntities();
        if (entities.length === 0) {
            throw new Error(
                'No entities marked as targeteable found for delete multiple'
            );
        }

        return this.deleteBuilder.getCypher(entities, this.params);
    }

    private getTargetEntities(): IGraphEntity[] {
        return this.entities.filter(e => e.isTargeteable);
    }
}
