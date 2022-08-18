address admin {
module SicBoV4 {
    use StarcoinFramework::Signer;
    use StarcoinFramework::Timestamp;
    use StarcoinFramework::Account;
    use StarcoinFramework::Token;
    use StarcoinFramework::Event;
    use StarcoinFramework::Vector;
    use StarcoinFramework::Hash;
    use StarcoinFramework::BCS;
    // use SFC::PseudoRandom;

    struct Bank<phantom T: store> has store, key {
        bank: Token::Token<T>
    }

    struct BankEvent<phantom T: store> has store, key {
        check_event: Event::EventHandle<CheckEvent>,
    }

    struct Game has key, store, drop {
        alice_secret: vector<u8>,
        bob_num: u8,
        alice_num: u8,
        timestamp: u64,
        alice_amount: u128,
        bob_amount: u128,
        camp: vector<u8>,
        alice_win: bool,
        bob_win: bool,
        alice_addr: address,
        bob_addr: address,
    }

     struct CheckEvent has store, drop {
        alice_num: u8,
        bob_num: u8,
        alice_win: bool,
        bob_win: bool,
        token_type: Token::TokenCode
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

    public(script) fun init_game<TokenType: store>(alice: signer, alice_secret: vector<u8>, amount: u128) acquires Bank, BankEvent {
        let account = &alice;

        let token = Account::withdraw<TokenType>(account, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        let game = Game {
            alice_secret: alice_secret,
            bob_num: 9,
            alice_num: 9,
            timestamp: Timestamp::now_seconds(),
            alice_amount: amount,
            bob_amount: 0,
            camp: Vector::empty(),
            alice_win: false,
            bob_win: false,
            alice_addr: Signer::address_of(account),
            bob_addr: Signer::address_of(account)
        };

        move_to(account, game);

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, CheckEvent{
            alice_num: 9,
            bob_num: 9,
            alice_win:false,
            bob_win: false,
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun bob_what<TokenType: store>(bob: signer, alice: address, bob_num: u8, amount: u128) acquires Game, Bank, BankEvent {
        let account = &bob;

        assert!(bob_num < 3, 10001);

        let token = Account::withdraw<TokenType>(account, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        let game = borrow_global_mut<Game>(alice);
        game.bob_num = bob_num;
        game.bob_amount = amount;
        game.bob_addr = Signer::address_of(account);

        assert!(game.bob_num == game.alice_num, 10002);

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, CheckEvent{
            alice_num: game.alice_num,
            bob_num: game.bob_num,
            alice_win: game.alice_win,
            bob_win: game.bob_win,
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun alice_what<TokenType: store>(alice: signer, alice_num: u8) acquires Game, Bank, BankEvent {
        let account = &alice;

        // check valid
        let temp_camp = Vector::empty();
        let addr = Signer::address_of(account);
        Vector::append(&mut temp_camp, BCS::to_bytes(&addr));
        Vector::append(&mut temp_camp, BCS::to_bytes(&alice_num));
        let camp = Hash::sha3_256(temp_camp);

        let game = borrow_global_mut<Game>(Signer::address_of(account));
        game.alice_num = alice_num % 3;
        game.camp = camp;
        
        // alice decrypt
        if (&game.camp == &game.alice_secret) {
            if (game.alice_num != game.bob_num) {
                if ((game.alice_num == 0 && game.bob_num == 2) || (game.alice_num == 1 && game.bob_num == 0) || (game.alice_num == 2 && game.bob_num == 1)) {
                    game.alice_win = true;
                    win_token<TokenType>(game.bob_addr, game.alice_amount + game.bob_amount);
                } else {
                    game.bob_win = true;  
                    win_token<TokenType>(game.alice_addr, game.alice_amount + game.bob_amount);
                }
            } else {
              game.alice_win = true;
              game.bob_win = true;  
              win_token<TokenType>(game.bob_addr, game.bob_amount);
              win_token<TokenType>(game.alice_addr, game.alice_amount);
            }
        } else {
            game.bob_win = true;
            win_token<TokenType>(game.bob_addr, game.alice_amount + game.bob_amount);
        };

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, CheckEvent{
            alice_num: game.alice_num,
            bob_num: game.bob_num,
            alice_win: game.alice_win,
            bob_win: game.bob_win,
            token_type: Token::token_code<TokenType>()
        });

        move_from<Game>(game.alice_addr);
    }

    public(script) fun over_game<TokenType: store>(everyone: signer, alice_addr: address) acquires Game, Bank {
        // every could get 30% for close game
        let game = borrow_global_mut<Game>(alice_addr);
        let now = Timestamp::now_seconds();
        assert!((now - game.timestamp) > 10 * 3600, 10003); // could close after 10 min

        win_token<TokenType>(Signer::address_of(&everyone), game.alice_amount * 3 / 10);
        win_token<TokenType>(game.alice_addr, game.alice_amount * 7 / 10);
        win_token<TokenType>(game.bob_addr, game.bob_amount);

        move_from<Game>(alice_addr);
    }

    fun win_token<TokenType: store>(winner: address, amount: u128) acquires Bank {
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        let token = Token::withdraw<TokenType>(&mut bank.bank, amount);
        Account::deposit<TokenType>(winner, token);
    }
}
}