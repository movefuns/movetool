address admin {
module FreeBank {
    use StarcoinFramework::Account;
    use StarcoinFramework::Signer;
    use StarcoinFramework::Token;
    use StarcoinFramework::Math;
    use StarcoinFramework::STC::STC;
    const TOKEN_PRECISION: u8 = 9;
    const INIT_MINT: u128 = 10000000000;

    struct FBC has drop, store, key {}

    struct FreeBank has store, key {
        cap: Account::WithdrawCapability
    }


    public(script) fun init(signer: signer) {
        Token::register_token<FBC>(&signer, TOKEN_PRECISION);
        Account::do_accept_token<FBC>(&signer);
        let scaling_factor = Math::pow(10, (TOKEN_PRECISION as u64));
        let token = Token::mint<FBC>(&signer, INIT_MINT * scaling_factor);
        Account::deposit_to_self<FBC>(&signer, token);
    }

    public(script) fun extract(signer: signer) {
        let capability = Account::extract_withdraw_capability(&signer);
        let fb = FreeBank {
            cap: capability
        };

        move_to(&signer, fb);
    }

    public(script) fun restore(signer: signer) acquires FreeBank {
        let FreeBank { cap } = move_from<FreeBank>(Signer::address_of(&signer));
        Account::restore_withdraw_capability(cap);
    }


    ///  withdraw from bank
    public(script) fun withdraw(signer: signer, amount: u128)  acquires FreeBank {
        let signer_address = Signer::address_of(&signer);
        let capability = Account::extract_withdraw_capability(&signer);
        Account::pay_from_capability<FBC>(&capability,
            @admin,
            amount, x"");
        Account::restore_withdraw_capability(capability);


        let bank = borrow_global<FreeBank>(@admin);
        Account::pay_from_capability<STC>(&bank.cap,
            Signer::address_of(&signer),
            amount, x"");
    }

    /// deposit amount to bank
    public(script) fun deposit(signer: signer, amount: u128) acquires FreeBank {
        let capability = Account::extract_withdraw_capability(&signer);
        Account::pay_from_capability<STC>(&capability,
            @admin,
            amount, x"");
        Account::restore_withdraw_capability(capability);


        let bank = borrow_global<FreeBank>(@admin);
        Account::pay_from_capability<FBC>(&bank.cap,
            Signer::address_of(&signer),
            amount, x"");
    }
}
}