import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import { Node } from '../../../../../../core/entities/neoEntities/node.entity';
import { CypherBuilder } from '../cypher.builder';
import { WhereServiceBuilder } from '../where';
import { EntitiesMatchBuiler } from './entitiesMatch.builder';
import { OptionalEntitiesMatchBuilder } from './optionalEntitiesMatch.builder';

export class SelectBuilder extends CypherBuilder {
    protected matchBuilder: EntitiesMatchBuiler;
    protected optionalMatchBuilder: OptionalEntitiesMatchBuilder;
    protected whereBuilder: WhereServiceBuilder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.matchBuilder = new EntitiesMatchBuiler(lineBreak, tabChar);
        this.optionalMatchBuilder = new OptionalEntitiesMatchBuilder(
            lineBreak,
            tabChar
        );
        this.whereBuilder = new WhereServiceBuilder(lineBreak, tabChar);
    }

    protected buildCypher() {
        const nonOptionalEntities: IGraphEntity[] = this.entities.filter(
            e => !e.isOptional
        );
        const optionalEntities: IGraphEntity[] = this.entities.filter(
            e => e.isOptional
        );

        let usedEntities: Node[] = [];
        let query: string = '';

        query += this.matchBuilder.getCypher(
            nonOptionalEntities,
            this.params,
            usedEntities
        );
        usedEntities = this.matchBuilder.getUsedNode();

        const wherePartForNormal = this.whereBuilder.getCypher(
            nonOptionalEntities,
            this.params
        );
        if (wherePartForNormal) query += wherePartForNormal;

        query += this.optionalMatchBuilder.getCypher(
            optionalEntities,
            this.params,
            usedEntities
        );
        usedEntities = this.optionalMatchBuilder.getUsedNode();

        return query.slice(0, -1);
    }
}
