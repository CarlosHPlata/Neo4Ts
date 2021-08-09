import { IGraphEntity } from './graph.entity';
import { Property } from './property.entity';

export class Node implements IGraphEntity {
    isReturnable: boolean = true;
    isOptional: boolean = false;
    isTargeteable: boolean = false;
    id?: string | number;
    properties: Property[] = [];

    constructor(public alias: string, public labels: string[]) {}
}
