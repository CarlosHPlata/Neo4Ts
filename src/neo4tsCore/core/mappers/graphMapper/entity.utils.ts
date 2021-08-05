import { GraphEntity } from '../../dtos/graphentity.dto';

export const getId = (
    graphEntity: GraphEntity
): string | number | undefined => {
    let id: string | number | undefined;

    let idValue = null;

    if (graphEntity.id) {
        idValue = graphEntity.id;
    }

    if (idValue != null) {
        //if (typeof idValue === 'object' && idValue.value) {
        //id = idValue.value;
        //} else if (typeof idValue == 'string' || typeof idValue == 'number') {
        id = idValue;
        //}
    }

    return id;
};

export const generateFakeAlias = (): string => {
    let r = Math.random()
        .toString(36)
        .substring(7);
    let date = new Date();

    let alias = 'e' + Date.now() + date.getMilliseconds() + r;
    return alias;
};

export const getLabels = (graphEntity: GraphEntity): string[] => {
    if (graphEntity.labels && graphEntity.label) {
        throw new Error(
            'Two identifiers for labels were found, you should use one of them (label or labels) not both'
        );
    }

    if (graphEntity.labels) {
        return getListOfLabels(graphEntity.labels);
    }

    if (graphEntity.label) {
        return getListOfLabels(graphEntity.label);
    }

    return [];
};

const getListOfLabels = (labels: string | string[]): string[] => {
    if (typeof labels === 'string') {
        return [labels];
    } else {
        return labels;
    }
};

export const pushGroupToAllProperties = (
    properties: Record<string, any>,
    newGroupName: string
) => {
    for (let index in properties) {
        let property = properties[index];
        if (property.group && property.group.length > 0) {
            property.group = newGroupName + '.' + property.group;
        } else {
            property.group = newGroupName;
        }
    }
};
