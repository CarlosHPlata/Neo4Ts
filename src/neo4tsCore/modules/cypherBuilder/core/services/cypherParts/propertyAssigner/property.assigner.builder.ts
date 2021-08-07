import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';
import {
    FilterValid,
    Operator,
    Property,
    PropertyTypes,
} from '../../../../../../core/entities/neoEntities/property.entity';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { CypherBuilder } from '../cypher.builder';
import * as FilterFactory from './filterCondition.factory';
import * as InexFilter from './indexFilter';
import * as OperatorFactory from './operator.factory';

export abstract class PropertyAssignerBuilder extends CypherBuilder {
    private doesFirstPass: boolean = false;

    protected filterAndConditionFactory: (
        property: Property,
        propertyName: string,
        paramValue: string
    ) => string;
    protected operatorFactory: (property: Property) => string;
    protected indexFilterCreator: (propery: Property) => string;

    protected entities: IGraphEntity[];
    protected params: ParamsHolder;

    protected PREFIX = '';

    constructor(lineBreak: string, tabChar: string) {
        super(lineBreak, tabChar);
        this.filterAndConditionFactory = FilterFactory.filterConditionFactory;
        this.operatorFactory = OperatorFactory.operatorFactory;
        this.indexFilterCreator = InexFilter.createIndexFilter;
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
            query += this.makeFiltersForEntity(entity);
        }

        return query;
    }

    protected makeFiltersForEntity(entity: IGraphEntity): string {
        if (entity.id) {
            return this.generateFilterStringForEntityWithId(entity);
        }

        return this.generateFiltersStringForEntity(entity);
    }

    protected generateFilterStringForEntityWithId(
        entity: IGraphEntity
    ): string {
        const indexProperty: Property = new Property(
            entity.alias,
            PropertyTypes.INDEX,
            entity.id || ''
        );

        let query: string = this.generateOperator(indexProperty);
        query += this.indexFilterCreator(indexProperty);

        return query;
    }

    protected generateFiltersStringForEntity(entity: IGraphEntity) {
        let query: string = '';

        for (const property of entity.properties || []) {
            if (this.isPropertySelectable(property)) {
                query += this.generateFiltersStringForProperty(
                    property,
                    entity
                );
            }
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

    protected isPropertySelectable(property: Property): boolean {
        return (
            property.isFilter === FilterValid.TRUE ||
            property.isFilter === FilterValid.UNSET
        );
    }

    private generateOperator(property: Property): string {
        let operator: string = '';

        if (!this.doesFirstPass) {
            if (property.operator !== Operator.AND) {
                throw new Error(
                    "In where filter, the first filte should be always an 'AND' operator"
                );
            }

            operator += this.getStringIfNoOperator();
            this.doesFirstPass = true;
        } else {
            operator += this.addOperatorStringDecorator(
                this.operatorFactory(property)
            );
        }

        return operator;
    }

    protected getStringIfNoOperator(): string {
        return this.TAB_CHAR;
    }

    protected addOperatorStringDecorator(operatorString: string): string {
        return this.LINE_BREAK + this.TAB_CHAR + operatorString + ' ';
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

    protected generatePropertyName(
        property: Property,
        parentEntity: IGraphEntity
    ): string {
        return `${parentEntity.alias}.${property.alias}`;
    }

    private appendPrefix(query: string): string {
        if (query) return this.PREFIX + this.LINE_BREAK + query;
        return '';
    }
}
