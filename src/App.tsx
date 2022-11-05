import { useMemo } from 'react';
import './App.css';
import Home from "./pages/Home/Home";
import { WalletProvider } from "@mysten/wallet-adapter-react";
import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-all-wallets";

function App() {
    const adapters = useMemo(() => [
        new WalletStandardAdapterProvider(),
    ], []);

    return (
        <div className="App">
            <WalletProvider adapters={adapters}>
                <Home/>
            </WalletProvider>
        </div>
    );
}

export default App;
