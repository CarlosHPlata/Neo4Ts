export const validateOneTypeArray = (dtoarray: any[]): boolean => {
    if (dtoarray.length > 0) {
        let firstType = typeof dtoarray[0];

        if (!validateAllowdTypes(firstType)) {
            return false;
        }

        let res: boolean = true;
        for (let index = 0; index < dtoarray.length; index++) {
            let element = dtoarray[index];
            if (typeof element != firstType) {
                return false;
            }
        }

        return res;
    } else return true;
};

const validateAllowdTypes = (valuetype: any): boolean => {
    switch (valuetype) {
        case 'number':
            return true;
        case 'boolean':
            return true;
        case 'string':
            return true;
        default:
            return false;
    }
};
