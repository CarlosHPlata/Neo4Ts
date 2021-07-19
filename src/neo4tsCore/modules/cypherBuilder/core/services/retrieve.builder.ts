import {DBAction} from "../../../../core/entities/db.action";
import {IGraphEntity} from "../../../../core/entities/neoEntities/graph.entity";
import * as SelectBuilder from "./cypherParts/select";

export class RetrieveBuilder extends DBAction {
    page: number|undefined;
    sieze: number|undefined;
    protected buildSelect: (entities:IGraphEntity[]) => string;

    constructor(
        entities: IGraphEntity[]
    ) {
        super(entities);
        this.buildSelect = SelectBuilder.buildSelect;
    }

    protected buildQuery(): string {
        let query: string = '';

        query += this.buildSelect(this.entities);
        //build query return

        return query;
    }
   
}
