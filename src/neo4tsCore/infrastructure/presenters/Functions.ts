import { GraphAbstraction } from '../../core/dtos/graph.abstraction.dto';
import { GraphSchema } from '../../core/dtos/graph.schema.dto';
import { ActionService } from '../../core/services/action.service';
import { SchemaService } from '../../core/services/schema.service';

export const makeActionFunctionalService = (
    actionService: ActionService,
    schemaService: SchemaService
) =>
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

        createMultiple: (entitiesPatternDto: GraphAbstraction) =>
            actionService.createMultiple(entitiesPatternDto),

        update: (entitiesPatternDto: GraphAbstraction, targetAlias: string) =>
            actionService.update(entitiesPatternDto, targetAlias),

        updateMultiple: (entitiesPatternDto: GraphAbstraction) =>
            actionService.updateMultiple(entitiesPatternDto),

        delete: (entitiesPatternDto: GraphAbstraction, targetAlias: string) =>
            actionService.delete(entitiesPatternDto, targetAlias),

        deleteMultiple: (entitiesPatternDto: GraphAbstraction) =>
            actionService.deleteMultiple(entitiesPatternDto),

        runCypher: (cypher: string, parameters: any = {}) =>
            actionService.runCypher(cypher, parameters),

        createSchema: (graphSchema: GraphSchema) =>
            schemaService.createSchema(graphSchema),
    });

const actionFunctionalService = makeActionFunctionalService(
    new ActionService(),
    new SchemaService()
);

/**
 * Create a pattern schema which you can use to build GraphAbstractions from it.
 * @param {GraphSchema} graphSchema - a dto which abstracts nodes and relationships but without properties or ids
 * @return {GraphSchemaEntity}
 */
export const createSchema = actionFunctionalService.createSchema;

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
 * @param {string} targetAlias - reference to an alias used on the entitiesPatternDto, this will be the entitie that will be created, if the entity is a node and has relationships, the relationships will be generated too.
 * @return {DBAction}
 */
export const create = actionFunctionalService.create;

/**
 * Make a create action that can be executed or used to generate a cypher string
 * The action can create multiple entities in the DB, it will look for entities marked with isTargeteable as true for creating them. if the entity is a node and has relationships, the relationships will be generated too.
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @return {DBAction}
 */
export const createMultiple = actionFunctionalService.createMultiple;

/**
 * Make an update action that can be executed or used to generate a cypher string
 * The action will update an entity in the DB using the alias of one as the target from the entities defined on the graph abstraction
 * @param {GraphAbstraction} entitiesPatternDto - a dto wich abstracts nodes and relationships
 * @param {string} targetAlias - reference to an alias used on the entitiesPatternDto, this will be the entitie that will be updated, all properties will be used to set properties if you want to set filters you have to defined using isFilter as true
 * @return {DBAction}
 */
export const update = actionFunctionalService.update;

/**
 * Make an update action that can be executed or used to generate a cypher string
 * The action will update entities in the DB, it will look for entities marked with isTargeteable as true for update them.
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @return {DBAction}
 */
export const updateMultiple = actionFunctionalService.updateMultiple;

/**
 * Make a Delete action that can be executed or used to generate a cypher string
 * The action will delete the selected entity in the DB using the alias of one as the target from the entities defined on the graph abstraction
 * @param {GraphAbstraction} entitiesPatternDto - a dto wich abstracts nodes and relationships
 * @param {string} targetAlias - reference to an alias used on the entitiesPatternDto, this will be the entitie that will be deleted
 * @return {DBAction}
 */
export const deleteAction = actionFunctionalService.delete;

/**
 * Make a delete aciton that can be executed or used to generate a cypher string
 * The aciton will delete entities in the DB, it will look for entities marked with isTargeteable as true for deleting them.
 * @param {GraphAbstraction} entitiesPatternDto - a dto which abstracts nodes and relationships
 * @return {DBAction}
 */
export const deleteMultiple = actionFunctionalService.deleteMultiple;

/**
 * Run a raw cypher with parameters
 * @param {string} cypher - the cypher to be executed
 * @param {string} [parameter] - parameters to be used on the cypher execution
 */
export const runCypher = actionFunctionalService.runCypher;
