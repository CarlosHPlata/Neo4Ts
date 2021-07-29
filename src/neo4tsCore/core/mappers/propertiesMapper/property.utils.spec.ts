import { validateOneTypeArray } from './property.utils';

describe('testing validate onte type array', () => {
    test('when sending an empty array return true', () => {
        expect(validateOneTypeArray([])).toBeTruthy();
    });

    test('when sending an invalid type return error', () => {
        expect(validateOneTypeArray([new Date()])).toBeFalsy();
    });

    test('when sending a valid array it returns true', () => {
        expect(validateOneTypeArray([1, 2, 3])).toBeTruthy();
    });

    test('when sending an invalid array it returns false', () => {
        expect(validateOneTypeArray([1, 'string'])).toBeFalsy();
    });
});
