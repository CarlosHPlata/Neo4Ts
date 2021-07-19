import {GraphAbstraction} from "../dtos/graph.abstraction.dto";
import {IGraphEntity} from "../entities/neoEntities/graph.entity";
import {EntityMapper} from "../mappers/graphMapper";
import {ActionsServices, getActionsServices} from "./actions.factory";

export class ActionService {
    protected entityMapper: EntityMapper;
    protected actionsServices: ActionsServices;

    constructor() {
        this.entityMapper = new EntityMapper();
        this.actionsServices = getActionsServices();
    }

    findAll(dto: GraphAbstraction, page?: number, size?: number): any[] {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(dto);
        const result = this.actionsServices.findEntities(entities, page, size);

        return [result];
    }

}
