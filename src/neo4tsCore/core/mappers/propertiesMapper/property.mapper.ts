import { GraphProperty } from '../../dtos/graphproperty.dto';
import {
    Property,
    PropertyTypes,
} from '../../entities/neoEntities/property.entity';
import { PropertyObjectMapper } from './property.object.mapper';
import { validateOneTypeArray } from './property.utils';

export class PropertyMapper {
    protected propertyObjectMapper: PropertyObjectMapper;

    constructor() {
        this.propertyObjectMapper = new PropertyObjectMapper();
    }

    getPropertiesFromDto(dbdto: Record<string, GraphProperty>): Property[] {
        let props: Property[] = [];

        let keys: string[] = Object.keys(dbdto);
        for (var key of keys) {
            if (dbdto[key] != null) {
                //if property is a date object
                if (dbdto[key] instanceof Date) {
                    props.push(
                        new Property(key, PropertyTypes.DATETIME, dbdto[key])
                    );

                    //if property is an array
                } else if (Array.isArray(dbdto[key])) {
                    if (validateOneTypeArray(dbdto[key] as any[])) {
                        props.push(
                            new Property(key, PropertyTypes.ARRAY, dbdto[key])
                        );
                    } else
                        throw new Error(
                            'Array property not valid, arrays can contains only ONE primitive type'
                        );

                    //if property is an object
                } else if (typeof dbdto[key] === 'object') {
                    props.push(
                        this.propertyObjectMapper.getPropertyIfObject(
                            key,
                            dbdto[key]
                        )
                    );

                    //if property is a primitive type
                } else {
                    props.push(this.getPropertyFromValue(key, dbdto[key]));
                }
            }
        }

        return props;
    }

    public getPropertyFromValue(
        alias: string,
        dbprop: GraphProperty
    ): Property {
        let prop: Property;

        if (dbprop instanceof Date) {
            return new Property(alias, PropertyTypes.DATETIME, dbprop);
        }

        switch (typeof dbprop) {
            case 'number':
                if (dbprop % 1 === 0) {
                    prop = new Property(alias, PropertyTypes.INTEGER, dbprop);
                } else {
                    prop = new Property(alias, PropertyTypes.FLOAT, dbprop);
                }
                break;
            case 'boolean':
                prop = new Property(alias, PropertyTypes.BOOLEAN, dbprop);
                break;
            case 'string':
                prop = new Property(alias, PropertyTypes.STRING, dbprop);
                break;
            default:
                throw new Error(
                    'A unkow type was found where trying to parse the object properties'
                );
        }

        return prop;
    }
}
