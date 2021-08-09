import { DBAction } from '../entities/db.action';
import { IGraphEntity } from '../entities/neoEntities/graph.entity';

export interface IQueryPort {
    generateRetrieveAction(
        entities: IGraphEntity[],
        page: number | undefined,
        size: number | undefined
    ): DBAction;

    generateCreateAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction;

    generateMultipleCreateAction(entities: IGraphEntity[]): DBAction;

    generateUpdateAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction;

    generateMultipleUpdate(entities: IGraphEntity[]): DBAction;

    generateDeleteAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction;

    generateDeleteMultipe(entities: IGraphEntity[]): DBAction;
}
