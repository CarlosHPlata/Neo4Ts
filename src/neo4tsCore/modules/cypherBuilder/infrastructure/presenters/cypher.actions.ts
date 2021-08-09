import { DBAction } from '../../../../core/entities/db.action';
import { IGraphEntity } from '../../../../core/entities/neoEntities/graph.entity';
import { IQueryPort } from '../../../../core/interfaces/query.port';
import { CreateBuilder } from '../../core/services/create.builder';
import { MultipleCreateAction } from '../../core/services/create.multiple.action';
import { DeleteBuilder } from '../../core/services/delete.builder';
import { DeleteMultipleAction } from '../../core/services/delete.multiple.action';
import { RetrieveBuilder } from '../../core/services/retrieve.builder';
import { UpdateBuilder } from '../../core/services/update.builder';
import { UpdateMultipleAction } from '../../core/services/update.multiple.action';

export class CypherActions implements IQueryPort {
    generateRetrieveAction(
        entities: IGraphEntity[],
        page: number | undefined,
        size: number | undefined
    ): DBAction {
        const retrieve = new RetrieveBuilder(entities);
        retrieve.page = page;
        retrieve.size = size;

        return retrieve;
    }

    generateCreateAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction {
        const create = new CreateBuilder(entities, target);
        return create;
    }

    generateMultipleCreateAction(entities: IGraphEntity[]): DBAction {
        const create = new MultipleCreateAction(entities);
        return create;
    }

    generateUpdateAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction {
        const update = new UpdateBuilder(entities, target);
        return update;
    }

    generateMultipleUpdate(entities: IGraphEntity[]): DBAction {
        return new UpdateMultipleAction(entities);
    }

    generateDeleteAction(
        entities: IGraphEntity[],
        target: IGraphEntity
    ): DBAction {
        const deleteAction = new DeleteBuilder(entities, target);
        return deleteAction;
    }

    generateDeleteMultipe(entities: IGraphEntity[]): DBAction {
        return new DeleteMultipleAction(entities);
    }
}
