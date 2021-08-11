import {GraphAbstraction, GraphRelationship} from "../dtos";

export class GraphSchemaEntity {
    constructor(
        private readonly fullGraphAbstraction: GraphAbstraction
    ) {}

    getAbstraction(selectedEntities?:string|string[], withRelationships?: boolean): GraphAbstraction {
        if (selectedEntities == null || selectedEntities.length === 0)
            return this.getAbstractionCopy();
        
        const entsNames = typeof selectedEntities === 'string'? [selectedEntities] : selectedEntities;
        return this.createNewAbstraction(entsNames, withRelationships !=null? withRelationships : true);
    }

    private getAbstractionCopy(): GraphAbstraction {
        return { ...this.fullGraphAbstraction };
    }

    private createNewAbstraction(selectedEntities: string[], withRelationships: boolean): GraphAbstraction {
        const abstraction: GraphAbstraction = {};

        for(const name of selectedEntities) {
            abstraction[name] = this.getAbstractionCopy()[name];
        }

        if (withRelationships) {
            const relationshipsEntries = this.getRelationshipNames(selectedEntities);
            for (const entry of relationshipsEntries) {
                abstraction[entry[0]] = entry[1];
            }
        }

        return abstraction;
    }


    private getRelationshipNames(selectedEntities: string[]) {
        const names = this.getOnlyNodeNames(selectedEntities);
        const entries = Object.entries(this.getAbstractionCopy());

        return entries.filter(entry => {
            const rel = entry[1] as GraphRelationship;
            return (
                (names.includes(rel.from || '') || names.includes(rel.source || ''))
                && (names.includes(rel.to || '') || names.includes(rel.target || ''))
            );
        });
    }

    private getOnlyNodeNames(selectedEntities: string[]): string[]{
        return selectedEntities.filter(name => {
            const abs = this.fullGraphAbstraction[name] as GraphRelationship;
            return abs.from == null && abs.to == null && abs.source == null && abs.target == null;
        });
    }
}
