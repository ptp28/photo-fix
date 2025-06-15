import {Button, FileButton, Group, Paper, Text} from "@mantine/core";
import {IconDownload, IconUpload} from "@tabler/icons-react";
import React, {RefObject, useEffect, useState} from "react";
import client from "../canvasService.ts";

interface ImageStatusBarProps {
    canvasRef: RefObject<HTMLCanvasElement | null>,
    imageLoaded: boolean,
    setImageLoaded: (status: boolean) => void,
    status: 'Ready' | 'Loading image...' | 'Image loaded' | 'Working on it...',
    setStatus: (status: 'Loading image...' | 'Image loaded' | 'Working on it...') => void,
}

export default function ImageStatusBar(props: ImageStatusBarProps) {
    useEffect(() => {
        if (!props.canvasRef) {
            return;
        }
    }, []);

    const handleFileChange = (file: File | null) => {
        if (!file) {
            return;
        }
        props.setImageLoaded(false);
        props.setStatus("Loading image...");
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = props.canvasRef.current;
                const ctx = canvas?.getContext("2d");
                if (!canvas || !ctx) {
                    return;
                }
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                client.loadImage(ctx.getImageData(0, 0, img.width, img.height));
                props.setImageLoaded(true);
                props.setStatus('Image loaded');
            }
            img.src = event.target?.result as string;
        }
        reader.readAsDataURL(file);
    }

    const handleDownload = async () => {

        const canvas = props.canvasRef.current
        if (!canvas) {
            return;
        }
        const link = document.createElement("a");
        link.download = `edited-image`;
        link.href = canvas.toDataURL();
        link.click();
    }

    return (
        <>
            <Paper shadow="xs" p="md" style={{backgroundColor: "var(--mantine-primary-color-light)"}}>
                <Group justify="space-between">
                    <Group gap={'lg'}>
                        <Text c="dimmed">Status: {props.status}</Text>
                    </Group>
                    <Group justify="space-around">
                        <FileButton onChange={handleFileChange} accept="image/*">
                            {(props) => (
                                <Button {...props} leftSection={<IconUpload size={14}/>}>
                                    Upload
                                </Button>
                            )}
                        </FileButton>
                        <Button leftSection={<IconDownload size={14}/>}
                                onClick={handleDownload}
                                disabled={!props.imageLoaded}
                        >
                            Download
                        </Button>
                    </Group>
                </Group>
            </Paper>
        </>
    );
}