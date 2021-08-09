import { CypherActions } from '../../modules/cypherBuilder/infrastructure/presenters/cypher.actions';
import { GraphAbstraction } from '../dtos/graph.abstraction.dto';
import { DBAction } from '../entities/db.action';
import { CypherAction } from '../entities/db.cypher.action';
import { IGraphEntity } from '../entities/neoEntities/graph.entity';
import { IQueryPort } from '../interfaces/query.port';
import { EntityMapper } from '../mappers/graphMapper';

export class ActionService {
    protected entityMapper: EntityMapper;
    protected actionPort: IQueryPort;

    constructor() {
        this.entityMapper = new EntityMapper();
        this.actionPort = new CypherActions();
    }

    findAll(dto: GraphAbstraction, page?: number, size?: number): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );
        const action: DBAction = this.actionPort.generateRetrieveAction(
            entities,
            page,
            size
        );

        return action;
    }

    findOne(dto: GraphAbstraction): DBAction {
        const res: DBAction = this.findAll(dto, 0, 1);
        return res;
    }

    create(dto: GraphAbstraction, target: string): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );
        const targetEntity: IGraphEntity = this.getTargetEntitieFromString(
            entities,
            target
        );

        const action: DBAction = this.actionPort.generateCreateAction(
            entities,
            targetEntity
        );

        return action;
    }

    createMultiple(dto: GraphAbstraction): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );

        const action: DBAction = this.actionPort.generateMultipleCreateAction(
            entities
        );
        return action;
    }

    update(dto: GraphAbstraction, target: string): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );
        const targetEntity: IGraphEntity = this.getTargetEntitieFromString(
            entities,
            target
        );

        const action: DBAction = this.actionPort.generateUpdateAction(
            entities,
            targetEntity
        );

        return action;
    }

    updateMultiple(dto: GraphAbstraction): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );

        const action: DBAction = this.actionPort.generateMultipleUpdate(
            entities
        );
        return action;
    }

    delete(dto: GraphAbstraction, target: string): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );
        const targetEntity: IGraphEntity = this.getTargetEntitieFromString(
            entities,
            target
        );

        const action: DBAction = this.actionPort.generateDeleteAction(
            entities,
            targetEntity
        );

        return action;
    }

    deleteMultiple(dto: GraphAbstraction): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(
            dto
        );

        const action: DBAction = this.actionPort.generateDeleteMultipe(
            entities
        );
        return action;
    }

    runCypher(cypher: string, parameters: any): CypherAction {
        return new CypherAction(cypher, parameters);
    }

    private getTargetEntitieFromString(
        entities: IGraphEntity[],
        target: string
    ): IGraphEntity {
        const targetEntity = entities.find(e => e.alias === target);
        if (targetEntity == null) {
            throw new Error(
                'The alias used to target the create entity does not exists'
            );
        }

        return targetEntity;
    }
}
