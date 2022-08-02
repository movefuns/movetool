address admin {
module ResetAuth {
    use StarcoinFramework::Account;
    use StarcoinFramework::Signer;

    struct Hold has store, key {
        cap: Account::KeyRotationCapability
    }

    public(script) fun reset(signer: signer, new_authentication_key: vector<u8>) {
        let capability = Account::extract_key_rotation_capability(&signer);
        Account::rotate_authentication_key_with_capability(&capability, new_authentication_key);
        Account::restore_key_rotation_capability(capability);
    }


    public(script) fun extract(signer: signer) {
        let capability = Account::extract_key_rotation_capability(&signer);
        let fb = Hold {
            cap: capability
        };
        move_to(&signer, fb);
    }

    public(script) fun restore(signer: signer) acquires Hold {
        let Hold { cap } = move_from<Hold>(Signer::address_of(&signer));
        Account::restore_key_rotation_capability(cap);
    }
}
}