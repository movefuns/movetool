import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ColorModeContext } from './utils/context';
import "./@types/global.d.ts"
import { BrowserRouter } from "react-router-dom";
import { store } from './store';
import { Provider } from 'react-redux';
import { getLocalTheme, setLocalTheme } from "./utils/localHelper";
import { createTheme, ThemeProvider } from "@mui/material";
import './utils/i18n';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<Index />);


function Index() {
    const localTheme = getLocalTheme();
    const [mode, setMode] = React.useState<'light' | 'dark'>(localTheme && localTheme === 'light' ? 'light' : 'dark');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const mode = prevMode === 'light' ? 'dark' : 'light';
                    setLocalTheme(mode);
                    return mode;
                });
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },

            }),
        [mode],
    );

    return <React.StrictMode>
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    </React.StrictMode>
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
