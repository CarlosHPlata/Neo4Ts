import {GraphAbstraction} from '../../core/dtos/graph.abstraction.dto';
import {DBAction} from '../../core/entities/db.action';
import {ActionService} from '../../core/services/action.service';

export const makeFindAll =
(actionService: ActionService) =>
(entitiesPatternDto: GraphAbstraction, page?: number, size?: number): DBAction => {
    return actionService.findAll(entitiesPatternDto, page, size);
};



export const findAll = makeFindAll(new ActionService());
