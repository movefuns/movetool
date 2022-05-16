import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WalletState {
    accountAddress?: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WalletState = {
    accountAddress: undefined,
    status: 'idle',
};


export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        set: (state, action: PayloadAction<string>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.accountAddress = action.payload;
        },
        del: (state) => {
            state.accountAddress = undefined;
        },
    },
});

export const {set, del} = walletSlice.actions;
export default walletSlice.reducer;
