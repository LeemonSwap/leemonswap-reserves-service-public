import axios from 'axios';
import {  each, groupBy } from 'lodash';

import { TokenBalance } from '../types';

const routerAccountId = [1062784, 1738940];

const client = axios.create({
    baseURL: 'https://beta.api.hgraph.io/v1/graphql',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.HGRAPH_KEY
    }
});

export const getExchangeRateForLp = async (pairs: TokenBalance[]) => {
    const token0 = pairs[0].balance;
    const token1 = pairs[1].balance;

    const exchangeRate = token0 / token1;
    console.log(exchangeRate);
};

export const discoverLpAddressFromTokens = async (tokenIds: number[]): Promise<number[][]> => {
    const getLPAddressesQuery = {
        operationName: 'GetLPAddresses',
        query: `query GetLPAddresses($tokenIds: [bigint!], $accountIds: [bigint!]) {
                token_balance(where: {account_id: {_in: $accountIds}},distinct_on:token_id) {
                    account_id
                    token {
                    name
                    treasury_account_id
                    token_id
                    }
                }
                token(where: {token_id: {_in: $tokenIds}}) {
                    name
                    decimals
                    token_id
                }
                }`,
        variables: {
        accountIds: routerAccountId,
        tokenIds: tokenIds
        },
    };
    const getLPAddressesQueryResponse = await client.post('', getLPAddressesQuery);
    const lpAddresses: TokenBalance[] = getLPAddressesQueryResponse.data.data.token_balance;
    const saucerLP = lpAddresses.filter((value) => value.account_id === routerAccountId[0]);
    const pangolinLP = lpAddresses.filter((value) => value.account_id === routerAccountId[1]);

    const saucerTreasuryAccounts = saucerLP.map((lp) => lp.token.treasury_account_id);
    const pangolinTreasuryAccounts = pangolinLP.map((lp) => lp.token.treasury_account_id);

    return [saucerTreasuryAccounts, pangolinTreasuryAccounts];
};

export const getLPReserves = async (accountIds: number[], tokenIds: number[]): Promise<TokenBalance[]> => {
    const getLPReservesQuery = {
        operationName: 'GetLPReserves',
        query: `query GetLPReserves($accountIds: [bigint!],$tokenIds:[bigint!],$timestamp:bigint) {
                token_balance(where: {
                    account_id: {_in: $accountIds},
                    token_id:{_in:$tokenIds},
                    consensus_timestamp: {_gt:$timestamp }
                }) {
                    account_id
                    token_id
                    balance
                    token{name,decimals}
                }
                }`,
        variables: {
        accountIds: accountIds,
        tokenIds: tokenIds,
        timestamp: ((+Date.now()) - 901000) * 1000000
        },
    };
    const getLPReservesQueryResponse = await client.post('', getLPReservesQuery);
    const lpReserve: TokenBalance[] = getLPReservesQueryResponse.data.data.token_balance;
    const groups = groupBy(lpReserve, (x) => x.account_id);
    let pairReserves: TokenBalance[] = [];
    each(groups, (x) => {
        if (x.length >= 2) pairReserves = x as TokenBalance[];
    });
    return pairReserves;
};

export const getPriceFor = async(token0: string, token1: string): Promise<number[]> => {
    const tokenIds: number[] = [Number(token0.split('0.0.')[1]), Number(token1.split('0.0.')[1])];
    const lpAddresses = await discoverLpAddressFromTokens(tokenIds);
    const [saucer, pangolin] = lpAddresses;
    const saucerReserves = await getLPReserves(saucer, tokenIds);
    const pangolinReserves = await getLPReserves(pangolin, tokenIds);
    console.log(`saucerReserves`, saucerReserves);
    console.log(`pangolinReserves`, pangolinReserves);
    await getExchangeRateForLp(saucerReserves);
    return [0];
};