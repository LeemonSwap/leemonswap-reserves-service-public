export type TokenBalance = {
    balance: number,
    token_id: number,
    account_id: number,
    token: Token
}
  
export type Token = {
    name: string,
    decimals: number,
    treasury_account_id: number
    token_id: number
}