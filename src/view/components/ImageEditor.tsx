import React, {useState, useRef, useEffect} from "react"
import {Container, Grid, Paper, Stack} from "@mantine/core"
import ImageStatusBar from "./ImageStatusBar.tsx";
import ControlsComponent from "./ControlsComponent.tsx";
import CanvasComponent from "./CanvasComponent.tsx";
import client from "../canvasService.ts";
import HistogramComponent from "./HistogramComponent.tsx";

export default function ImageEditor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [status, setStatus] = useState< 'Ready' | 'Loading image...' | 'Image loaded' | 'Working on it...'>('Ready');
    const [histogramData, setHistogramData] = useState<number[][] | undefined>();

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) {
            return;
        }
        client.addOnImageAdjustmentChangeCallback(() => {setHistogramData(client.getImageHistogramData())});
    }, []);

    useEffect(() => {
        if(!imageLoaded) {
            return;
        }
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) {
            return;
        }
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        client.loadImage(imageData);
        setImageLoaded(true);
    }, [imageLoaded]);

    return (
        <Container size={"xl"}>
            <Stack>
                <ImageStatusBar
                    imageLoaded={imageLoaded}
                    setImageLoaded={setImageLoaded}
                    canvasRef={canvasRef}
                    status={status}
                    setStatus={setStatus}
                />
                <Grid>
                    <Grid.Col span={{base: 12, sm: 12, md: 9}}>
                        <Stack>
                            <CanvasComponent canvasRef={canvasRef} />
                            <HistogramComponent histogramData={histogramData}/>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 12, md: 3}}>
                        <ControlsComponent
                            canvasRef={canvasRef}
                            imageLoaded={imageLoaded}
                            setStatus={setStatus}/>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    )
}

