import {IGraphEntity} from "../../../../../../core/entities/neoEntities/graph.entity";
import {Condition, Operator, Property, PropertyTypes} from "../../../../../../core/entities/neoEntities/property.entity";
import {ParamsHolder} from "../../../../../../core/entities/paramsHolder";

export class WhereServiceBuilder {
    private doesFirstPass: boolean = false;

    constructor(
        private entities: IGraphEntity[],
        private params: ParamsHolder
    ) {}

    getWhere(): string {
        let query: string = this.generateFiltersQueryString();

        if (query.length > 0)
            query = this.appendPrefix(query);

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

        for (const property of entity.properties||[]) {
            query += this.generateFiltersStringForProperty(property, entity);
        }

        return query;
    }

    private generateFiltersStringForProperty(property: Property, parentEntity: IGraphEntity) {
        let query: string = '';
        
        query += this.generateOperator(property);

        query += this.generateFilterWithCondition(property, parentEntity);

        return query;
    }

    private generateOperator(property: Property): string {
        let operator: string = '';

        if (!this.doesFirstPass) {
            if (property.operator != Operator.AND) {
                throw new Error('In where filter, the first filte should be always an "AND" operator');
            }

            operator += '\n\t';
            this.doesFirstPass = true;
        } else {
            operator += this.generateFilterOperatorString(property);
        }

        return operator;
    }

    private generateFilterOperatorString(property: Property): string {
        switch( property.operator ) {
            case Operator.AND:
                return '\n\tAND';
            case Operator.OR:
                return '\n\tOR';
            case Operator.NOT:
                return '\n\tNOT';
            case Operator.XOR:
                return '\n\tXOR';
            default:
                return '\n\tAND';
        }
    }

    private generateFilterWithCondition(property: Property, parentEntity: IGraphEntity): string {

        let propertyName = this.generatePropertyName(property, parentEntity);
        let paramValue = this.params.getParamNameForQuery(parentEntity.alias, property.alias);

        return this.generateFilterStringWithCondition(property, propertyName, paramValue);
    }

    private generatePropertyName(property: Property, parentEntity: IGraphEntity): string {
        return `${parentEntity.alias}.${property.alias}`; 
    }


    private generateFilterStringWithCondition(
        property: Property,
        propertyName: string,
        paramValue: string
    ): string {
        switch( property.condition ) {
            case Condition.DIFFERENT:
                return `${propertyName} <> ${paramValue}`;
            
            case Condition.CONTAINS:
                if( property.type !== PropertyTypes.STRING){
                    throw new Error('Contains is an operator only available on strings');
                }
                return `toLower(${propertyName}) CONTAINS ${paramValue}`;

            case Condition.NOTCONTAINS:
                if( property.type !== PropertyTypes.STRING){
                    throw new Error('Contains is an operator only available on strings');
                }
                return `(not ( toLower(${propertyName}) CONTAINS toLower(${paramValue}) ))`;

            case Condition.STARTS:
                if( property.type !== PropertyTypes.STRING){
                    throw new Error('Contains is an operator only available on strings');
                }
                return `toLower(${propertyName}) STARTS WITH toLower(${paramValue})`;

            case Condition.ENDS:
                if( property.type !== PropertyTypes.STRING){
                    throw new Error('Contains is an operator only available on strings');
                }
                return `toLower(${propertyName}) ENDS WITH toLower(${paramValue})`;

            case Condition.GREATER:
                if ( property.type !== PropertyTypes.INTEGER && property.type !== PropertyTypes.FLOAT ) {
                    throw new Error('Greater is an operator only available on numeric types');
                }
                return `${propertyName} > ${paramValue}`;

            case Condition.GREATEREQUAL:
                if (
                    property.type !== PropertyTypes.INTEGER && property.type !==  PropertyTypes.FLOAT &&
                    property.type !== PropertyTypes.DATE && property.type !== PropertyTypes.TIME &&
                    property.type !== PropertyTypes.DATETIME
                ) {
                    throw new Error('Greater or Equal (>=) is an operator only available on numeric or date types');
                }
                return `${propertyName} >= ${paramValue}`;

            case Condition.LOWER:
                if ( property.type !== PropertyTypes.INTEGER && property.type !== PropertyTypes.FLOAT ) {
                    throw new Error('LOWER is an operator only available on numeric types');
                }
                return `${propertyName} < ${paramValue}`;

            case Condition.LOWEREQUAL:
                if (
                    property.type !== PropertyTypes.INTEGER && property.type !==  PropertyTypes.FLOAT &&
                    property.type !== PropertyTypes.DATE && property.type !== PropertyTypes.TIME &&
                    property.type !== PropertyTypes.DATETIME
                ) {
                    throw new Error('Lower or Equal (<=) is an operator only available on numeric or date types');
                }
                return `${propertyName} <= ${paramValue}`;

            case Condition.IN:
                return `${paramValue} IN ${propertyName}`;

            case Condition.REVERSEIN:
                return `${propertyName} IN ${paramValue}`;

            case Condition.EQUAL:
            default:
                return `${propertyName} = ${paramValue}`;
        }
    }

    private appendPrefix(query: string): string {
        if (query) return 'WHERE\n'+query;
        return '';
    }

}
