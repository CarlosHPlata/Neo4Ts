import {
    FilterValid,
    IGraphEntity,
    Property,
} from '../../../../../../core/entities';
import { CypherBuilder } from '../cypher.builder';
import { SelectBuilder } from '../select/select.service';
import { EntitiesUpdateBuilder } from './entities.update.builder';

export class UpdateService extends CypherBuilder {
    protected matchBuilder: SelectBuilder;
    protected updateBuilder: EntitiesUpdateBuilder;

    private allTargetProps: Property[] = [];

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new SelectBuilder(lineBreak, tabChar);
        this.updateBuilder = new EntitiesUpdateBuilder(lineBreak, tabChar);
    }

    protected buildCypher(target: IGraphEntity): string {
        this.extractTargetProps(target);

        const matchEntities: IGraphEntity[] = this.getMatchEntities(target);
        const matchPart: string = this.matchBuilder.getCypher(
            matchEntities,
            this.params
        );

        const targetPrepared: IGraphEntity = this.prepareTargetForUpdate(
            target
        );
        const updatePart: string = this.updateBuilder.getCypher(
            [targetPrepared],
            this.params
        );

        let query: string = matchPart + updatePart;
        query = query !== '' ? query.slice(0, -1) : '';

        return query;
    }

    private extractTargetProps(target: IGraphEntity): void {
        this.allTargetProps = target.properties ? [...target.properties] : [];
        target.properties = [];
    }

    private getMatchEntities(target: IGraphEntity): IGraphEntity[] {
        const matchEntities: IGraphEntity[] = this.entities.filter(
            e => e !== target
        );
        target.properties = this.allTargetProps.filter(
            p => p.isFilter === FilterValid.TRUE
        );
        matchEntities.push(target);

        return matchEntities;
    }

    private prepareTargetForUpdate(target: IGraphEntity): IGraphEntity {
        target.properties = this.allTargetProps.filter(
            p => p.isFilter !== FilterValid.TRUE
        );
        return target;
    }
}
