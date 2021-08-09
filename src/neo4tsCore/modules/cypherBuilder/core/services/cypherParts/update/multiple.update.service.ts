import {
    FilterValid,
    IGraphEntity,
    Property,
} from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesUpdateBuilder } from './entities.update.builder';

export class MultipleUpdateService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected updateBuilder: EntitiesUpdateBuilder;

    private allTargetProperties: Record<string, Property[]> = {};

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.updateBuilder = new EntitiesUpdateBuilder(lineBreak, tabChar);
    }

    protected buildCypher(): string {
        this.extractTargetProperties();

        const matchPart = this.getMatchPart();
        const updatePart = this.getUpdatePart();

        return this.prepareQueryString(matchPart + updatePart);
    }

    private getMatchPart(): string {
        const entities = this.getMatchEntities();

        return this.matchBuilder.getCypher(entities, this.params);
    }

    private getUpdatePart(): string {
        const entities: IGraphEntity[] = this.getTargetEntities();
        if (entities.length === 0) {
            throw new Error(
                'No entities marked as targeteable found for update multiple'
            );
        }

        return this.updateBuilder.getCypher(entities, this.params);
    }

    private getTargetEntities(): IGraphEntity[] {
        const entities = this.entities.filter(e => e.isTargeteable);
        entities.forEach(e => {
            e.properties = this.allTargetProperties[e.alias].filter(
                e => e.isFilter !== FilterValid.TRUE
            );
        });

        return entities;
    }

    private getMatchEntities(): IGraphEntity[] {
        const targets = this.entities.filter(e => e.isTargeteable);
        const restOfEnts = this.entities.filter(e => !e.isTargeteable);

        targets.forEach(e => {
            e.properties = this.allTargetProperties[e.alias].filter(
                e => e.isFilter === FilterValid.TRUE
            );
        });

        return [...targets, ...restOfEnts];
    }

    private extractTargetProperties() {
        this.entities
            .filter(e => e.isTargeteable)
            .forEach(entity => {
                this.allTargetProperties[entity.alias] = [
                    ...(entity.properties || []),
                ];
            });
    }
}
