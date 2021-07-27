import {CypherActions} from '../../modules/cypherBuilder/infrastructure/presenters/cypher.actions';
import {GraphAbstraction} from '../dtos/graph.abstraction.dto';
import {DBAction} from '../entities/db.action';
import {IGraphEntity} from '../entities/neoEntities/graph.entity';
import {IQueryPort} from '../interfaces/query.port';
import {EntityMapper} from '../mappers/graphMapper';

export class ActionService {
    protected entityMapper: EntityMapper;
    protected actionPort: IQueryPort;

    constructor() {
        this.entityMapper = new EntityMapper();
        this.actionPort = new CypherActions();
    }

    findAll(dto: GraphAbstraction, page?: number, size?: number): DBAction {
        const entities: IGraphEntity[] = this.entityMapper.getEntitiesFromDtoArray(dto);
        const action: DBAction = this.actionPort.generateRetrieveAction(entities, page, size);

        return action;
    }

}
