import React from 'react';
import ReactDOM from 'react-dom/client';
import Window from './components/Window.tsx';
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import theme from './theme';

document.title = "Image Editor";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <Window />
        </MantineProvider>
    </React.StrictMode>
)
