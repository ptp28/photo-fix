import {createTheme} from "@mantine/core";

const  theme = createTheme({

    colors: {
        'custom-gray': [
            "#e0e0e0",
            "#bdbdbd",
            "#9e9e9e",
            "#757575",
            "#616161",
            "#424242",
            "#2e2e2e",
            "#1f1f1f",
            "#141414",
            "#0a0a0a",
            "#000000",
        ],
    },
    primaryColor: 'custom-gray',
    primaryShade: { light: 7, dark: 3 },
});

export default theme;