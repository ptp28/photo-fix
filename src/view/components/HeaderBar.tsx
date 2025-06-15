import {Group, Title} from "@mantine/core";
import React from "react";
import PhotoFixLogo from '/PhotoFixLogo.png';

export default function HeaderBar() {

    return (
        <header
            style={{
                height: '56px',
                marginBottom: "60px",
                backgroundColor: "var(--mantine-primary-color-light)",
                borderBottom: "2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
            }}>
            <Group justify="center" align="center" style={{height: '100%', padding: '5px'}}>
                <img src={PhotoFixLogo} height={"75%"} alt="logo" />
                <Title order={1}>
                    PhotoFix
                </Title>
            </Group>
        </header>
    );
}