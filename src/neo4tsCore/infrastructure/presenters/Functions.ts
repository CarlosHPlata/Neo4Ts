import { GraphAbstraction } from '../../core/dtos/graph.abstraction.dto';
import { ActionService } from '../../core/services/action.service';

export const makeActionFunctionalService = (actionService: ActionService) =>
    Object.freeze({
        findAll: (
            entitiesPatternDto: GraphAbstraction,
            page?: number,
            size?: number
        ) => actionService.findAll(entitiesPatternDto, page, size),

        findOne: (entitiesPatternDto: GraphAbstraction) =>
            actionService.findOne(entitiesPatternDto),

        create: (entitiesPatternDto: GraphAbstraction, targetAlias: string) =>
            actionService.create(entitiesPatternDto, targetAlias),
    });

const actionFunctionalService = makeActionFunctionalService(
    new ActionService()
);

/**
 * Create a find all action that can be executed or used to generate a cypher string
 * The action will retrieve all instances matching the pattern given on the entities pattern dto
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @param {number} [page] - If you want to use paginatiion you can send the page number to retrieve data
 * @param {number} [size] - If you want to use pagination you can send the size of your page
 * @return {DBAction}
 */
export const findAll = actionFunctionalService.findAll;

/**
 * create a find one action that can be executed or used to generate a cypher string
 * The action will retrieve the first record matching the pattern given on the entities pattern dto
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @return {DBAction}
 */
export const findOne = actionFunctionalService.findOne;

/**
 * Make a create action that can be executed or used to generate a cypher string
 * The action will create an entitie in the DB using the alias of one as the target from the entities defined on the graph abstraction
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @param {string} targetAlias - reference to an alias used on the entitiesPatternDto, this will be the entitie that will be created, if the entitie is a node and has relationships, the relationships will be generated too.
 * @return {DBAction}
 */
export const create = actionFunctionalService.create;
