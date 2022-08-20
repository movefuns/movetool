address admin {
module SicBoV9 {
    use StarcoinFramework::Signer;
    use StarcoinFramework::Timestamp;
    use StarcoinFramework::Account;
    use StarcoinFramework::Token;
    use StarcoinFramework::Event;
    use StarcoinFramework::Vector;
    use StarcoinFramework::Hash;
    use StarcoinFramework::BCS;
    use StarcoinFramework::Option;
    // use SFC::PseudoRandom;

    const GameValidTime: u64 = 10 * 60; // 10 min

    struct Bank<phantom T: store> has store, key {
        bank: Token::Token<T>
    }

    struct GameEvent<phantom T: store> has store, key {
        start_event: Event::EventHandle<GameStartEvent>,
        join_event: Event::EventHandle<GameJoinEvent>,
        end_event: Event::EventHandle<GameEndEvent>,
        over_event: Event::EventHandle<GameOverEvent>
    }

    struct Game has key, store, drop {
        opener_secret: vector<u8>,
        opener_num: u8,
        participant_num: u8,
        timestamp: u64,
        amount: u128,
        camp: vector<u8>,
        opener_win: u8, // 0 1 2 3; 0 init 1 win 2 lose 3 draw
        opener_addr: address,
        participant_addr: Option::Option<address>,
    }

    struct GameStartEvent has store, drop {
        addr: address,
        token_type: Token::TokenCode
    }

    struct GameJoinEvent has store, drop {
        addr: address,
        token_type: Token::TokenCode
    }

    struct GameEndEvent has store, drop {
        addr: address,
        token_type: Token::TokenCode
    }

    struct GameOverEvent has store, drop {
        addr: address,
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
        move_to(account, GameEvent<TokenType>{
            start_event: Event::new_event_handle<GameStartEvent>(account),
            join_event: Event::new_event_handle<GameJoinEvent>(account),
            end_event: Event::new_event_handle<GameEndEvent>(account),
            over_event: Event::new_event_handle<GameOverEvent>(account)
        });
    }

    public(script) fun start_game<TokenType: store>(opener: signer, opener_secret: vector<u8>, amount: u128) acquires Bank, GameEvent {
        let account = &opener;

        let token = Account::withdraw<TokenType>(account, amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        let game = Game {
            opener_secret: opener_secret,
            opener_num: 9,
            participant_num: 9,
            timestamp: Timestamp::now_seconds(),
            amount: amount,
            camp: Vector::empty(),
            opener_win: 0,
            opener_addr: Signer::address_of(account),
            participant_addr: Option::none()
        };

        move_to(account, game);

        let game_event = borrow_global_mut<GameEvent<TokenType>>(@admin);
        Event::emit_event(&mut game_event.start_event, GameStartEvent{
            addr: Signer::address_of(account),
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun join_game<TokenType: store>(participant: signer, opener_addr: address, participant_num: u8) acquires Game, Bank, GameEvent {
        assert!(participant_num < 3, 10006);

        let account = &participant;
        let game = borrow_global_mut<Game>(opener_addr);

        assert!(Option::is_none<address>(&game.participant_addr), 10007); // only one participant allowed

        let token = Account::withdraw<TokenType>(account, game.amount);
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        Token::deposit<TokenType>(&mut bank.bank, token);

        game.participant_num = participant_num;
        game.amount = game.amount + game.amount;
        game.participant_addr = Option::some(Signer::address_of(account));

        let game_event = borrow_global_mut<GameEvent<TokenType>>(@admin);
        Event::emit_event(&mut game_event.join_event, GameJoinEvent{
            addr: Signer::address_of(account),
            token_type: Token::token_code<TokenType>()
        });
    }

    public(script) fun end_game<TokenType: store>(opener: signer, opener_num: u8) acquires Game, Bank, GameEvent {
        let account = &opener;
        let addr = Signer::address_of(account);
        let game = borrow_global_mut<Game>(addr);
        game.opener_num = opener_num % 3;

        let now = Timestamp::now_seconds();
        assert!((now - game.timestamp) <= GameValidTime, 10008); // could end in 10 min

        // check valid
        let temp_camp = Vector::empty();
        Vector::append(&mut temp_camp, BCS::to_bytes(&addr));
        Vector::append(&mut temp_camp, BCS::to_bytes(&opener_num));
        let camp = Hash::sha3_256(temp_camp);
        game.camp = camp;

        if (Option::is_none<address>(&game.participant_addr)) { 
            game.opener_win = 1;  // win
            win_token<TokenType>(game.opener_addr, game.amount);
        } else if (&game.camp == &game.opener_secret) {
            if (game.opener_num != game.participant_num) {
                if ((game.opener_num == 0 && game.participant_num == 2) || (game.opener_num == 1 && game.participant_num == 0) || (game.opener_num == 2 && game.participant_num == 1)) {
                    game.opener_win = 2; // lose
                    win_token<TokenType>(Option::extract<address>(&mut game.participant_addr), game.amount);
                } else {
                    game.opener_win = 1;  // win
                    win_token<TokenType>(game.opener_addr, game.amount);
                }
            } else {
              game.opener_win = 3; // draw
              win_token<TokenType>(game.opener_addr, game.amount / 2 );
              win_token<TokenType>(Option::extract<address>(&mut game.participant_addr), game.amount / 2);
            }
        } else {
            game.opener_win = 2; // lose
            win_token<TokenType>(Option::extract<address>(&mut game.participant_addr), game.amount);
        };

        let game_event = borrow_global_mut<GameEvent<TokenType>>(@admin);
        Event::emit_event(&mut game_event.end_event, GameEndEvent{
            addr: Signer::address_of(account),
            token_type: Token::token_code<TokenType>()
        });

        move_from<Game>(game.opener_addr);
    }

    public(script) fun over_game<TokenType: store>(everyone: signer, opener_addr: address) acquires Game, Bank, GameEvent {
        // every could get 10% for close game
        assert!(Signer::address_of(&everyone) != opener_addr, 10009); // opener connot over game
        
        let game = borrow_global_mut<Game>(opener_addr);
        let now = Timestamp::now_seconds();
        
        assert!((now - game.timestamp) > GameValidTime, 10010); // could close after 10 min

        if (Option::is_none<address>(&game.participant_addr)) {
            win_token<TokenType>(Signer::address_of(&everyone), game.amount);
        } else {
            win_token<TokenType>(Signer::address_of(&everyone), game.amount / 10);
            win_token<TokenType>(Option::extract<address>(&mut game.participant_addr), game.amount * 9 / 10);
        };

        let game_event = borrow_global_mut<GameEvent<TokenType>>(@admin);
        Event::emit_event(&mut game_event.over_event, GameOverEvent{
            addr: Signer::address_of(&everyone),
            token_type: Token::token_code<TokenType>()
        });

        move_from<Game>(opener_addr);
    }

    fun win_token<TokenType: store>(winner: address, amount: u128) acquires Bank {
        let bank = borrow_global_mut<Bank<TokenType>>(@admin);
        let token = Token::withdraw<TokenType>(&mut bank.bank, amount);
        Account::deposit<TokenType>(winner, token);
    }
}
}