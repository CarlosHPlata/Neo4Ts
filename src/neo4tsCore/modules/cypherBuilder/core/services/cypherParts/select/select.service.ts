import {IGraphEntity} from "../../../../../../core/entities/neoEntities/graph.entity";
import {Node} from "../../../../../../core/entities/neoEntities/node.entity";
import {EntitiesMatchBuiler} from "./entitiesMatch.builder";
import {OptionalEntitiesMatchBuilder} from "./optionalEntitiesMatch.builder";

export const makeBuildSelect = 
    (matchBuilder: EntitiesMatchBuiler, optionalMatchBuilder:OptionalEntitiesMatchBuilder) => 
    (entities: IGraphEntity[]): string => 
{
    const nonOptionalEntities: IGraphEntity[] = entities.filter(e => !e.isOptional);
    const optionalEntities: IGraphEntity[] = entities.filter(e => e.isOptional);
    let usedEntities: Node[] = [];
    let query: string = '';

    query += matchBuilder.build(nonOptionalEntities, usedEntities);
    usedEntities = matchBuilder.getUsedNode();

    query += optionalMatchBuilder.build(optionalEntities, usedEntities);
    usedEntities = optionalMatchBuilder.getUsedNode();

    return query;
};

export const buildSelect = makeBuildSelect(new EntitiesMatchBuiler(), new OptionalEntitiesMatchBuilder());
