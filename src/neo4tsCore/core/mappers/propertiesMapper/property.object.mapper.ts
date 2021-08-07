import { GraphPropertyDefinition } from '../../dtos/graphproperty.dto';
import {
    Condition,
    FilterValid,
    Operator,
    Property,
    PropertyTypes,
} from '../../entities/neoEntities/property.entity';
import { OperatorFactory } from './operator.factory';
import { PropertyConditionFactory } from './property.condition.factory';
import { PropertyTypeValueFactory } from './property.type.value.factory';

export class PropertyObjectMapper {
    protected propertyValueTypeFactory: (
        alias: string,
        dbprop: GraphPropertyDefinition
    ) => Property;
    protected propertyConditionFactory: (value: string) => Condition;
    protected operatorFactory: (value: string) => Operator;

    constructor() {
        this.propertyValueTypeFactory = PropertyTypeValueFactory;
        this.propertyConditionFactory = PropertyConditionFactory;
        this.operatorFactory = OperatorFactory;
    }

    getPropertyIfObject(
        alias: string,
        dbprop: GraphPropertyDefinition | any
    ): Property {
        if (dbprop.type != null && dbprop.value != null) {
            return this.buildObjectPropertyWithTypeAndValue(alias, dbprop);
        } else if (
            (dbprop.type && !dbprop.value) ||
            (!dbprop.type && dbprop.value)
        ) {
            throw new Error(
                "Can't parse a property causevalue or type is null or undefined"
            );
        } else {
            return this.buildObjectPropertyAsJson(alias, dbprop);
        }
    }

    private buildObjectPropertyWithTypeAndValue(
        alias: string,
        dbprop: GraphPropertyDefinition
    ): Property {
        try {
            return this.buildObjectProperty(alias, dbprop);
        } catch (e) {
            throw new Error(
                'error parsing object in PropertyProvider for key: ' + alias
            );
        }
    }

    private buildObjectProperty(
        alias: string,
        dbprop: GraphPropertyDefinition
    ): Property {
        let prop: Property = this.propertyValueTypeFactory(alias, dbprop);
        prop = this.addPropertyDecoratorsFromDto(prop, dbprop);

        return prop;
    }

    private addPropertyDecoratorsFromDto(
        prop: Property,
        dto: GraphPropertyDefinition
    ): Property {
        if (dto.condition) {
            prop.condition = this.propertyConditionFactory(dto.condition);
        }

        if (dto.operator) {
            prop.operator = this.operatorFactory(dto.operator);
        }

        if (dto.isReturnable != null && typeof dto.isReturnable == 'boolean') {
            prop.isReturnable = dto.isReturnable;
        }

        if (dto.isFilter != null && typeof dto.isFilter == 'boolean') {
            prop.isFilter = dto.isFilter ? FilterValid.TRUE : FilterValid.FALSE;
        }

        if (dto.group) {
            prop.filterGroups = this.generateNewFilterGroups(prop, dto.group);
        }

        return prop;
    }

    private buildObjectPropertyAsJson(alias: string, dbprop: any): Property {
        console.warn(
            'WARNING FROM Neo4TS: an object was parsed as a property and converted into json string format',
            'object found in: ' + alias
        );

        return new Property(
            alias,
            PropertyTypes.STRING,
            JSON.stringify(dbprop)
        );
    }

    private generateNewFilterGroups(
        property: Property,
        groupsString: string
    ): string[] {
        let groups: string[] = property.filterGroups;
        let newGroups = groupsString.split('.');

        for (let newGroup of newGroups) {
            if (newGroup && newGroup !== '') {
                groups.push(newGroup);
            } else
                throw new Error(
                    `Error generating filter groups, an invalid group was found`
                );
        }

        return groups;
    }
}
