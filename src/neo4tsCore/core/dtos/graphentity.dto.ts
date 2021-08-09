import { GraphProperty } from './graphproperty.dto';

export type GraphEntity = {
    id?: string | number;
    label?: string | string[];
    labels?: string | string[];
    properties?: Record<string, GraphProperty>;
    isReturnable?: boolean;
    isOptional?: boolean;
    isGroup?: boolean;
    isTargeteable?: boolean;
};
