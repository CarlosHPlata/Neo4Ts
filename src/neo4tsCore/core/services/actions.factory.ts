import {IGraphEntity} from "../entities/neoEntities/graph.entity";
import {findEntities} from "./findAll/findall.service";

export const getActionsServices = (): ActionsServices => {
    return Object.freeze({
        findEntities: findEntities
    });
};

export type ActionsServices = {
    findEntities: (entities: IGraphEntity[], page?: number, size?: number) => Promise<any>; 
};
