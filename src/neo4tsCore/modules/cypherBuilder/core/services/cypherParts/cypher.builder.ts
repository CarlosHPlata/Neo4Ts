import { IGraphEntity } from '../../../../../core/entities/neoEntities/graph.entity';
import { ParamsHolder } from '../../../../../core/entities/paramsHolder';

export abstract class CypherBuilder {
    protected entities: IGraphEntity[] = [];
    protected params: ParamsHolder = new ParamsHolder();

    constructor(protected LINE_BREAK: string, protected TAB_CHAR: string) {}

    getCypher(
        entities: IGraphEntity[],
        params: ParamsHolder,
        ...extraParams: any[]
    ): string {
        this.entities = entities;
        this.params = params;

        const res = this.buildCypher(...extraParams);

        if (res) return res + this.LINE_BREAK;
        else return '';
    }

    protected abstract buildCypher(...extraParams: any[]): string;

    setLineBreak(lineBreak: string): void {
        this.LINE_BREAK = lineBreak;
    }

    setTabChar(tabchar: string): void {
        this.TAB_CHAR = tabchar;
    }


    protected prepareQueryString(query: string): string {
        query = query !== '' ? query.slice(0, -1) : '';
        return query;
    }
}
