address admin {
module SicBoV2 {
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
        check_event: Event::EventHandle<GameEvent>,
    }

    struct Game has key, store, drop {
        aliceSecret: vector<u8>,
        bobNum: u8,
        aliceNum: u8,
        timestamp: u64,
        aliceAmount: u128,
        bobAmount: u128,
        camp: vector<u8>,
        aliceWin: bool,
        bobWin: bool,
        aliceAddr: address,
        bobAddr: address,
    }

    struct GameEvent has store, drop {
        aliceAmount: u128,
        bobAmount: u128,
        aliceWin: bool,
        bobWin: bool,
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
            check_event: Event::new_event_handle<GameEvent>(account),
        });
    }

    public(script) fun init_game<TokenType: store>(alice: signer, aliceSecret: vector<u8>, amount: u128) acquires Bank, BankEvent {
        let account = &alice;

        let token = Account::withdraw<TokenType>(account, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        let game = Game {
            aliceSecret: aliceSecret,
            bobNum: 0,
            aliceNum: 0,
            timestamp: Timestamp::now_seconds(),
            aliceAmount: amount,
            bobAmount: 0,
            camp: Vector::empty(),
            aliceWin: false,
            bobWin: false,
            aliceAddr: Signer::address_of(account),
            bobAddr: Signer::address_of(account)
        };

        move_to(account, game);

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, GameEvent{
            aliceAmount: amount,
            bobAmount: 0,
            aliceWin:false,
            bobWin: false,
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun bob_what<TokenType: store>(bob: signer, alice: address, bobNum: u8, amount: u128) acquires Game, Bank, BankEvent {
        let account = &bob;

        let token = Account::withdraw<TokenType>(account, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        let game = borrow_global_mut<Game>(alice);
        game.bobNum = bobNum;
        game.bobAmount = amount;
        game.bobAddr = Signer::address_of(account);

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, GameEvent{
            aliceAmount: game.aliceAmount,
            bobAmount: amount,
            aliceWin: game.aliceWin,
            bobWin: game.bobWin,
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun alice_what<TokenType: store>(alice: signer, aliceNum: u8) acquires Game, Bank, BankEvent {
        let account = &alice;
        // let token = Account::withdraw<TokenType>(account, amount);

        let game = borrow_global_mut<Game>(Signer::address_of(account));
        game.aliceNum = aliceNum;

        // check valid
        let tempCamp = Vector::empty();

        let addr = Signer::address_of(account);
        
        Vector::append(&mut tempCamp, BCS::to_bytes(&addr));
        Vector::append(&mut tempCamp, BCS::to_bytes(&aliceNum));
        
        let camp = Hash::sha3_256(tempCamp);
        game.camp = camp;
        
        if (&game.camp == &game.aliceSecret) {
            if (game.aliceNum % 2 > game.bobNum % 2) {
              game.aliceWin = true;
              win_token<TokenType>(game.aliceAddr, game.aliceAmount + game.bobAmount);
            } else if (game.aliceNum % 2 < game.bobNum %2) {
              game.bobWin = true;  
              win_token<TokenType>(game.bobAddr, game.aliceAmount + game.bobAmount);
            } else {
              game.aliceWin = true;
              game.bobWin = true;  
              win_token<TokenType>(game.bobAddr, game.bobAmount);
              win_token<TokenType>(game.aliceAddr, game.aliceAmount);
            }
        } else {
            game.bobWin = true;
            win_token<TokenType>(game.bobAddr, game.aliceAmount + game.bobAmount);
        };

        let bank_event = borrow_global_mut<BankEvent<TokenType>>(@admin);
        Event::emit_event(&mut bank_event.check_event, GameEvent{
            aliceAmount: game.aliceAmount,
            bobAmount: game.bobAmount,
            aliceWin: game.aliceWin,
            bobWin: game.bobWin,
            token_type: Token::token_code<TokenType>()
        });

        move_from<Game>(game.aliceAddr);
    }

    fun win_token<TokenType: store>(winner: address, amount: u128) acquires Bank {
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        let token = Token::withdraw<TokenType>(&mut bank.bank, amount);
        Account::deposit<TokenType>(winner, token);
    }
}
}