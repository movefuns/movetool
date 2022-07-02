address admin {
module GameFingerGuessing {
    use StarcoinFramework::Account;
    use StarcoinFramework::Signer;
    use StarcoinFramework::Token;
    use StarcoinFramework::Event;
    use SFC::PseudoRandom;

    struct Bank<phantom T: store> has store, key {
        bank: Token::Token<T>
    }

    struct CheckEvent has store, drop {
        amount: u128,
        result: u8,
        input: u8,
        token_type: Token::TokenCode
    }

    struct BankEvent<phantom T: store> has store, key {
        check_event: Event::EventHandle<CheckEvent>,
    }

    /// @admin init bank
    public(script) fun init_bank<TokenType: store>(signer: signer, amount: u128) {
        let account = &signer;
        let signer_addr = Signer::address_of(account);

        assert!(signer_addr == @admin, 10003);
        assert!(! exists<Bank<TokenType>>(signer_addr), 10004);
        assert!(Account::balance<TokenType>(signer_addr) >= amount, 10005);

        let token = Account::withdraw<TokenType>(account, amount);
        move_to(account, Bank<TokenType>{
            bank: token
        });

        move_to(account, BankEvent<TokenType>{
            check_event: Event::new_event_handle<CheckEvent>(account),
        });
    }

    /// @admin withdraw from bank
    public(script) fun withdraw<TokenType: store>(signer: signer, amount: u128) acquires Bank {
        let signer_addr = Signer::address_of(&signer);

        assert!(signer_addr == @admin, 10003);
        assert!(exists<Bank<TokenType>>(signer_addr), 10004);

        let bank = borrow_global_mut<Bank<TokenType>>(signer_addr);
        let token = Token::withdraw<TokenType>(&mut bank.bank, amount);
        Account::deposit<TokenType>(signer_addr, token);
    }

    /// everyone can deposit amount to bank
    public(script) fun deposit<TokenType: store>(signer: signer, amount: u128)  acquires Bank {
        assert!(exists<Bank<TokenType>>(@admin), 10004);

        let token = Account::withdraw<TokenType>(&signer, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);
    }


    fun win_token<TokenType: store>(signer: signer, amount: u128) acquires Bank {
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        let token = Token::withdraw<TokenType>(&mut bank.bank, amount);
        Account::deposit<TokenType>(Signer::address_of(&signer), token);
    }

    fun loss_token<TokenType: store>(signer: signer, amount: u128) acquires Bank {
        let token = Account::withdraw<TokenType>(&signer, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);
    }

    /// get result for this
    fun get_robot_result(): u8 {
        ((PseudoRandom::rand_u64(&@admin) % 3) as u8)
    }

    /// check game result
    public(script) fun check<TokenType: store>(account: signer, amount: u128, input: u8) acquires Bank, BankEvent {
        let signer_addr = Signer::address_of(&account);

        //  check account amount
        assert!(Account::balance<TokenType>(signer_addr) > amount, 10003);

        // can't all in @admin balance  max only   1/10  every times
        assert!(Token::value<TokenType>(&borrow_global<Bank<TokenType>>(@admin).bank) >= amount * 10, 10004);

        // Player parameter limit cannot be greater than or equal to 3
        assert!(input < 3, 10004);

        let result = get_robot_result();

        if (input != result) {
            if ((input == 0 && result == 2) || (input == 1 && result == 0) || (input == 2 && result == 1)) {
                win_token<TokenType>(account, amount);
            } else {
                loss_token<TokenType>(account, amount);
            }
        };

        // event
        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, CheckEvent{
            amount,
            result,
            input,
            token_type: Token::token_code<TokenType>()
        });
    }
}
}