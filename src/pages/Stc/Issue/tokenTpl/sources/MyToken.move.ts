const MyTokenSourceTpl = (tokenName:string, tokenPrecision:number) => {
    return `module ${tokenName}::${tokenName} {
    use StarcoinFramework::Token;
    use StarcoinFramework::Account;

    struct ${tokenName} has copy, drop, store { }

    public(script) fun init(account: signer) {
        Token::register_token<${tokenName}>(&account, ${tokenPrecision});
        Account::do_accept_token<${tokenName}>(&account);
    }

    public(script) fun mint(account: signer, amount: u128) {
        let token = Token::mint<${tokenName}>(&account, amount);
        Account::deposit_to_self<${tokenName}>(&account, token)
    }
}`
}

export {MyTokenSourceTpl}