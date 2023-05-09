//During the test the env variable is set to test
process.env.ENV_TYPE = 'test'
process.env.NODE_ENV = 'test'

const whbarAddr = '0.0.1456986'
const usdc = '0.0.456858'
const usdt = '0.0.1055472'

const assert = require('assert');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
let expect = chai.expect

export const request = (method: 'get' | 'post' | 'delete', url: string, body?: any, token?: string) => {
    return new Promise<any>((resolve, reject) => {
        const api = chai.request(server);
        api[method](url)
            .set('Authorization', 'Bearer ' + token)
            .send(body)
            .end((error: any, res: any) => {
                if (!error) {
                    return resolve(res);
                }
                return reject(error);
            });
    });
};

chai.use(chaiHttp);

describe('GET /balances', () => {
    before(async () => {
    });

    it('should return pricing', async () => {
        const res = await request('get', `/aggregator/pricefor/${usdc}/${usdt}`);
    });
});