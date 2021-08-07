import {
    Condition,
    FilterValid,
    IGraphEntity,
    Property,
} from '../../../../../../core/entities';
import { PropertyAssignerBuilder } from '../propertyAssigner/property.assigner.builder';

export class EntitiesUpdateBuilder extends PropertyAssignerBuilder {
    protected operatorFactory = () => ',';

    protected PREFIX = 'SET';

    protected makeFiltersForEntity(entity: IGraphEntity) {
        return this.generateFiltersStringForEntity(entity);
    }

    protected isPropertySelectable(property: Property): boolean {
        const isValid: boolean =
            property.isFilter === FilterValid.UNSET ||
            property.isFilter === FilterValid.FALSE;

        if (isValid && property.condition !== Condition.EQUAL) {
            throw new Error(
                `Error while reading properties for update, property ${property.alias} has not equality set, if this is a filter mark it with isFilter as true`
            );
        }

        return isValid;
    }

    protected addOperatorStringDecorator(operator: string): string {
        return operator + this.LINE_BREAK + this.TAB_CHAR;
    }
}
