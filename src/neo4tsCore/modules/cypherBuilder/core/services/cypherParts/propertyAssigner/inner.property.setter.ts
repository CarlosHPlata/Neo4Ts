import { Condition, Property } from '../../../../../../core/entities';
import { PropertyAssignerBuilder } from './property.assigner.builder';

export const innerConditionFactory = (
    property: Property,
    propertyName: string,
    paramValue: string
) => {
    if (property.condition !== Condition.EQUAL)
        throw new Error(
            'Cannot assign a property with the condition set different from equal'
        );

    return `${propertyName}: ${paramValue}`;
};

export class InnerPropertySetter extends PropertyAssignerBuilder {
    protected filterAndConditionFactory = innerConditionFactory;
    protected operatorFactory = () => ',';
    protected PREFIX = '';

    protected buildCypher(): string {
        let query: string = super.buildCypher();
        if (!query) return '';

        return `{${query}${this.LINE_BREAK}}`;
    }

    protected generatePropertyName(property: Property): string {
        return `${property.alias}`;
    }

    protected addOperatorStringDecorator(operator: string): string {
        return operator + this.LINE_BREAK + this.TAB_CHAR;
    }
}
