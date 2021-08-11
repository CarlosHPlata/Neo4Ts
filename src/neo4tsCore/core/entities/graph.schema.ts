import {GraphAbstraction, GraphRelationship} from "../dtos";

export class GraphSchemaEntity {
    private readonly ALIAS_INDEX = 0; 
    private readonly ABSTRACTION_INDEX = 1;

    constructor(
        private readonly fullGraphAbstraction: GraphAbstraction
    ) {}

    /**
     * It retuns a valid GraphAbstraction based on the original scheme.
     *  
     *  @param {string|string[]} [selectedEntities] - it will filter the schema and return only the entities you need
     *  @param {boolean} [withRelationships=true] - it will tell the filter functionality to retrieve you the relationships for all nodes matching your selectedEntities
     */
    getAbstraction(selectedEntities?:string|string[], withRelationships?: boolean): GraphAbstraction {
        if (selectedEntities == null || selectedEntities.length === 0)
            return this.getAbstractionCopy();
        
        const entsNames = typeof selectedEntities === 'string'? [selectedEntities] : selectedEntities;
        return this.createNewAbstraction(entsNames, withRelationships !=null? withRelationships : true);
    }

    /**
     * It retuns a valid GraphAbstraction using a new set of properties, it will find for the original scheme and override the shceme with your properties defined on newSetOFAbstraction.
     *  
     *  @param {GraphAbstraction} newSetOfAbstraction - used to override and add properties to the original schema
     *  @param {string|string[]} [selectedEntities] - it will filter the schema and return only the entities you need
     *  @param {boolean} [withRelationships=true] - it will tell the filter functionality to retrieve you the relationships for all nodes matching your selectedEntities
     */
    getAbstractionOverride(newSetOfAbstraction: GraphAbstraction, selectedEntities?:string|string[], withRelationships?: boolean): GraphAbstraction {
        const newAbstraction = this.getAbstraction(selectedEntities, withRelationships);

        return this.mergeAbstraciton(newAbstraction, newSetOfAbstraction);
    }

    private mergeAbstraciton(originalAbstraction: GraphAbstraction, newStateAbstraction:GraphAbstraction): GraphAbstraction {
        const newAbs: GraphAbstraction = {};
        const originalEntries = Object.entries(originalAbstraction);
        const newStateEntries = Object.entries(newStateAbstraction);

        for (const originalEntry of originalEntries) {
            const newStateEntry = newStateEntries.find(entry => entry[this.ALIAS_INDEX] === originalEntry[this.ALIAS_INDEX]) || [originalEntry[this.ALIAS_INDEX], {}];

            newAbs[originalEntry[this.ALIAS_INDEX]] = { ...originalEntry[this.ABSTRACTION_INDEX], ...newStateEntry[this.ABSTRACTION_INDEX]  };
        }

        return newAbs;
    }

    private getAbstractionCopy(): GraphAbstraction {
        return JSON.parse( JSON.stringify(this.fullGraphAbstraction) );
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
