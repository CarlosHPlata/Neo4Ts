import {DBAction} from "../../../../core/entities/db.action";
import {IGraphEntity} from "../../../../core/entities/neoEntities/graph.entity";
import {IQueryPort} from "../../../../core/interfaces/query.port";
import {RetrieveBuilder} from "../../core/services/retrieve.builder";

export class CypherActions implements IQueryPort {

    generateRetrieveAction(entities: IGraphEntity[], page: number|undefined, size:number|undefined): DBAction {
        const retrieve = new RetrieveBuilder(entities);
        retrieve.page = page;
        retrieve.size = size;

        return retrieve;
    }

}
