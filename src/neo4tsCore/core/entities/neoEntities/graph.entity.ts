import { Property } from './property.entity';

export interface IGraphEntity {
    id?: string | number;
    alias: string;
    labels: string[];
    properties?: Property[];
    isOptional?: boolean;
    isReturnable?: boolean;
    isTargeteable?: boolean;
}
