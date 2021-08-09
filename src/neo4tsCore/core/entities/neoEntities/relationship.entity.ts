import { IGraphEntity } from './graph.entity';
import { Node } from './node.entity';
import { Property } from './property.entity';

export class Relationship implements IGraphEntity {
    isReturnable: boolean = true;
    isOptional: boolean = false;
    isTargeteable: boolean = false;
    id?: string | number;
    properties?: Property[];

    constructor(
        public alias: string,
        public labels: string[],
        public source: Node,
        public target: Node
    ) {}
}
