import { Neo4jValueFactory } from '../../infrastructure/factories/neo4j.driver.value.factory';
import { ParamValueFactory } from '../interfaces/abstract.param.value.factory';
import { IGraphEntity } from './neoEntities/graph.entity';
import { Property } from './neoEntities/property.entity';

type propertyHolder = Record<string, { name: string; value: any }>;
type entitiesParams = Record<string, propertyHolder>;

export class ParamsHolder {
    private paramHolder: entitiesParams;
    protected valueFactory: ParamValueFactory;

    constructor() {
        this.paramHolder = {};
        this.valueFactory = Neo4jValueFactory;
    }

    addParammeters(graphEntities: IGraphEntity[]): void {
        this.paramHolder = {};
        for (const entity of graphEntities) {
            this.addPropertiesParams(entity);
        }
    }

    addPropertiesParams(entity: IGraphEntity): void {
        if (entity.properties && entity.properties.length === 0) return;

        this.paramHolder[entity.alias] = {};
        for (const property of entity.properties || []) {
            this.paramHolder[entity.alias][property.alias] = {
                name: this.generateParamName(property),
                value: this.generateParamValue(property),
            };
        }
    }

    protected generateParamName(property: Property): string {
        const r = Math.random()
            .toString(36)
            .substring(7);
        const date = new Date();
        return 'p' + Date.now() + date.getMilliseconds() + r + property.alias;
    }

    private generateParamValue(property: Property): any {
        return this.valueFactory(property);
    }

    getParamName(entityAlias: string, propertyAlias: string): string {
        const paramHolder: propertyHolder | undefined = this.paramHolder[
            entityAlias
        ];

        if (paramHolder == null)
            throw new Error('no param found by that entity alias');

        const holder: { name: string; value: any } | undefined =
            paramHolder[propertyAlias];

        if (holder == null)
            throw new Error('no param found by that property alias');

        return holder.name;
    }

    getParamNameForQuery(entityAlias: string, propertyAlias: string): string {
        const paramName: string = this.getParamName(entityAlias, propertyAlias);

        return `$${paramName}`;
    }

    getParamsForDatabaseUse(): any {
        const params: any = {};

        for (const [, propertyHolder] of Object.entries(this.paramHolder)) {
            for (const [, paramDto] of Object.entries(propertyHolder)) {
                params[paramDto.name] = paramDto.value;
            }
        }

        return params;
    }
}
