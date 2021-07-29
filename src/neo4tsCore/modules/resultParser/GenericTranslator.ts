import * as neo4j from 'neo4j-driver';

export function MapToJson(map: any) {
    let newJson: any = null;
    let tempJson: any = null;
    if (map.hasOwnProperty('records')) {
        if (map.records.length > 0) {
            newJson = { rows: [] };
            map.records.forEach((record: any) => {
                if (
                    record.hasOwnProperty('keys') &&
                    record.hasOwnProperty('_fields') &&
                    record.hasOwnProperty('_fieldLookup')
                ) {
                    tempJson = {};
                    record.keys.forEach(function(key: any) {
                        let recordValue =
                            record._fields[record._fieldLookup[key]];
                        tempJson[key] = getValue(recordValue);
                    });
                    newJson.rows.push(tempJson);
                }
            });
        }
    }
    return newJson;
}

export function getValue(recordValue: any) {
    let isNode = false;
    let isRelationship = false;
    let isArray = false;
    let isObject = false;
    let isInteger = false;
    let isBool = false;
    let tempObj: any = null;
    let nodeKeys = null;

    if (recordValue) {
        isNode =
            recordValue.hasOwnProperty('identity') &&
            recordValue.hasOwnProperty('properties') &&
            recordValue.hasOwnProperty('labels');
        isRelationship =
            recordValue.hasOwnProperty('identity') &&
            recordValue.hasOwnProperty('properties') &&
            recordValue.hasOwnProperty('start') &&
            recordValue.hasOwnProperty('end') &&
            recordValue.hasOwnProperty('type');
        isArray = Array.isArray(recordValue);
        isObject = typeof recordValue === 'object';
        isInteger = neo4j.isInt(recordValue);
        if (recordValue === 'true' || recordValue === 'false') {
            isBool = true;
        }
    }

    if (
        isNode ||
        isRelationship ||
        isArray ||
        (isObject && !isInteger) ||
        isBool
    ) {
        if (isNode) {
            tempObj = {};
            nodeKeys = Object.keys(recordValue.properties);
            nodeKeys.forEach(function(nodeKey) {
                tempObj[nodeKey] = getValue(recordValue.properties[nodeKey]);
            });
        } else if (isRelationship) {
            tempObj = {};
            nodeKeys = Object.keys(recordValue.properties);
            nodeKeys.forEach(function(nodeKey) {
                tempObj[nodeKey] = getValue(recordValue.properties[nodeKey]);
            });
        } else if (isArray) {
            tempObj = [];
            recordValue.forEach((element: any) => {
                tempObj.push(getValue(element));
            });
        } else if (isObject) {
            tempObj = {};
            nodeKeys = Object.keys(recordValue);
            nodeKeys.forEach(function(nodeKey) {
                tempObj[nodeKey] = getValue(recordValue[nodeKey]);
            });
        } else if (isBool) {
            if (recordValue === 'true') {
                tempObj = true;
            } else if (recordValue === 'false') {
                tempObj = false;
            }
        }
    } else {
        if (isInteger) {
            if (neo4j.integer.inSafeRange(recordValue))
                tempObj = neo4j.int(recordValue).toNumber();
            else tempObj = recordValue.toString();
        } else tempObj = recordValue;
    }
    return tempObj;
}
