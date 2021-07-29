import { DBAction } from '../entities/db.action';
import { IGraphEntity } from '../entities/neoEntities/graph.entity';

export interface IQueryPort {
    generateRetrieveAction(
        entities: IGraphEntity[],
        page: number | undefined,
        size: number | undefined
    ): DBAction;
}
