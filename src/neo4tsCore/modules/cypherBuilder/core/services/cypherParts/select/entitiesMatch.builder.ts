import {PatternBuilder} from '../pattern/pattern.builder';

export class EntitiesMatchBuiler extends PatternBuilder {
    protected QUERY_PREFIX = 'MATCH';
   
    protected getNodesAndRelationshipsPatternString(): [string, string] {
        return this.patternWithRelationshipFirst();
    } 
}
