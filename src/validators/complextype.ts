// wrapping old validator to perform additional checks on the new one
import { isArray } from 'lodash';
import * as moment from 'moment';
import * as validator from 'validator';


function isInArray(value: any, array: any) {
    return array.indexOf(value) > -1;
}

export function isValidArray(input: any) {
    if (isArray(input) && input.length > 0) {
        return true;
    }
    return false;
}

export function isDate(input: string) {
    const date = moment(input, 'YYYY-MM-DDTHH:mm:ssZ').utc();

    return date.isValid();
}

export function isETHAddress(input: string) {
    if (validator.isEthereumAddress(input)) {
        return true;
    }
    return false;
}