export const generateSkip = (
    page: number | undefined,
    size: number | undefined
): string => {
    if (page && size) {
        return `SKIP ${page * size}`;
    }

    return '';
};

export const generateLimit = (size: number | undefined): string => {
    if (size) {
        return `LIMIT ${size}`;
    }

    return '';
};

export const generateSkipAndLimit = (
    page: number | undefined,
    size: number | undefined
): string => {
    let query: string = '';

    if (page && size && page > 0 && size > 0) {
        query += generateSkip(page, size) + ' ';
    }

    if (size && size > 0) {
        query += generateLimit(size);
    }

    return query;
};
