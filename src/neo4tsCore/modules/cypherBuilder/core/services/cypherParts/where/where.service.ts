import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import {
    Operator,
    Property,
} from '../../../../../../core/entities/neoEntities/property.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { CypherBuilder } from '../cypher.builder';
import * as FilterFactory from './filterCondition.factory';
import * as OperatorFactory from './operator.factory';

export class WhereServiceBuilder extends CypherBuilder {
    private doesFirstPass: boolean = false;

    protected filterAndConditionFactory: (
        property: Property,
        propertyName: string,
        paramValue: string
    ) => string;
    protected operatorFactory: (property: Property) => string;

    protected entities: IGraphEntity[];
    protected params: ParamsHolder;

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.filterAndConditionFactory = FilterFactory.filterConditionFactory;
        this.operatorFactory = OperatorFactory.operatorFactory;
        this.entities = [];
        this.params = new ParamsHolder();
    }

    protected buildCypher(): string {
        let query: string = this.generateFiltersQueryString();

        if (query.length > 0) query = this.appendPrefix(query);

        return query;
    }

    protected generateFiltersQueryString(): string {
        let query: string = '';
        this.doesFirstPass = false;

        for (const entity of this.entities) {
            query += this.generateFiltersStringForEntity(entity);
        }

        return query;
    }

    private generateFiltersStringForEntity(entity: IGraphEntity) {
        let query: string = '';

        for (const property of entity.properties || []) {
            query += this.generateFiltersStringForProperty(property, entity);
        }

        return query;
    }

    private generateFiltersStringForProperty(
        property: Property,
        parentEntity: IGraphEntity
    ) {
        let query: string = '';

        query += this.generateOperator(property);

        query += this.generateFilterWithCondition(property, parentEntity);

        return query;
    }

    private generateOperator(property: Property): string {
        let operator: string = '';

        if (!this.doesFirstPass) {
            if (property.operator !== Operator.AND) {
                throw new Error(
                    "In where filter, the first filte should be always an 'AND' operator"
                );
            }

            operator += this.TAB_CHAR;
            this.doesFirstPass = true;
        } else {
            operator +=
                this.LINE_BREAK +
                this.TAB_CHAR +
                this.operatorFactory(property) +
                ' ';
        }

        return operator;
    }

    private generateFilterWithCondition(
        property: Property,
        parentEntity: IGraphEntity
    ): string {
        let propertyName = this.generatePropertyName(property, parentEntity);
        let paramValue = this.params.getParamNameForQuery(
            parentEntity.alias,
            property.alias
        );

        return this.filterAndConditionFactory(
            property,
            propertyName,
            paramValue
        );
    }

    private generatePropertyName(
        property: Property,
        parentEntity: IGraphEntity
    ): string {
        return `${parentEntity.alias}.${property.alias}`;
    }

    private appendPrefix(query: string): string {
        if (query) return 'WHERE' + this.LINE_BREAK + query;
        return '';
    }
}
