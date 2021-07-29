import { IGraphEntity } from '../../../../../../core/entities/neoEntities/graph.entity';

export const simpleReturnBuilder = (entities: IGraphEntity[]) => {
    let query: string = '';
    for (const entity of entities) {
        if (entity.isReturnable) {
            query += query ? ', ' : '';
            query += entity.alias;
        }
    }

    return query;
};
