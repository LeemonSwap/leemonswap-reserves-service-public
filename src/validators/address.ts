import * as JsonSchema from 'jsonschema';

import * as complextype from './complextype';

// loading additional formats
JsonSchema.Validator.prototype.customFormats.isETHAddress = complextype.isETHAddress;

const addSchema = {
    id: '/address/add',
    type: 'object',
    properties: {
        address: { type: 'string', format: 'isETHAddress' },
    },
    required: ['address'],
};

const validator = new JsonSchema.Validator();

export function Add(p: any) {
    return validator.validate(p, addSchema);
}