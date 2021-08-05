import { Node } from '../../../../../../core/entities';
import { generateInnerFunction } from '../pattern/inner.builder';
import { PatternBuilder } from '../pattern/pattern.builder';

export class EntitiesCreateBuilder extends PatternBuilder {
    protected QUERY_PREFIX = 'CREATE';

    protected buildCypher(usedNodes: Node[] = []): string {
        this.innerFn = generateInnerFunction(
            this.LINE_BREAK,
            this.TAB_CHAR,
            this.params
        );

        return super.buildCypher(usedNodes);
    }

    protected getNodesAndRelationshipsPatternString(): [string, string] {
        return this.patternWithNodesFirst();
    }
}
