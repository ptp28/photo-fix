import {Button, ButtonGroup, Grid, Group, Paper, Slider, Stack, Text, Title} from "@mantine/core";
import React, {RefObject, useCallback, useEffect, useState} from "react";
import {IconArrowBackUp} from "@tabler/icons-react";
import {debounce} from "lodash";
import client, {IImageAdjustmentsValues} from "../canvasService.ts";


interface ControlsComponentProps {
    canvasRef: RefObject<HTMLCanvasElement | null>,
    imageLoaded: boolean,
    setStatus: (status: 'Ready' | 'Loading image...' | 'Image loaded' | 'Working on it...') => void,
}

export default function ControlsComponent(props: ControlsComponentProps) {
    const [brightness, setBrightness] = useState<number>(0);
    const [contrast, setContrast] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(0);
    const [verticalFlipFlag, setVerticalFlipFlag] = useState<boolean>(false);
    const [horizontalFlipFlag, setHorizontalFlipFlag] = useState<boolean>(false);
    const [sepiaFlag, setSepiaFlag] = useState<boolean>(false);
    const [invertFlag, setInvertFlag] = useState<boolean>(false);
    const [greyscaleMethod, setGreyScaleMethod] = useState<'value' | 'luma' | 'intensity' | undefined>();
    const [blurFlag, setBlurFlag] = useState<boolean>(false);
    const [sharpenFlag, setSharpenFlag] = useState<boolean>(false);
    const [pixelateFlag, setPixelateFlag] = useState<boolean>(false);
    const [ditherFlag, setDitherFlag] = useState<boolean>(false);

    const toggleGrayscale = (selectedGrayscale: 'value' | 'luma' | 'intensity' | undefined) => {
        if(greyscaleMethod == selectedGrayscale) {
            setGreyScaleMethod(undefined);
        }
        else {
            setGreyScaleMethod(selectedGrayscale);
        }
    }

    const resetAllChanges = () => {
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setVerticalFlipFlag(false);
        setHorizontalFlipFlag(false);
        setSepiaFlag(false);
        setInvertFlag(false);
        setGreyScaleMethod(undefined);
        setBlurFlag(false);
        setSharpenFlag(false);
        setPixelateFlag(false);
        setDitherFlag(false);
    }

    const applyAdjustments = useCallback(
        debounce(() => {
            const canvas = props.canvasRef.current;
            const ctx = canvas?.getContext("2d");

            if (!canvas || !ctx || !props.imageLoaded) {
                return;
            }
            props.setStatus('Working on it...');
            const imageAdjustmentValues: IImageAdjustmentsValues = {
                brightness: brightness,
                contrast: contrast,
                saturation: saturation,
                verticalFlipFlag: verticalFlipFlag,
                horizontalFlipFlag: horizontalFlipFlag,
                sepiaFlag: sepiaFlag,
                invertFlag: invertFlag,
                greyscaleMethod: greyscaleMethod,
                blurFlag: blurFlag,
                sharpenFlag: sharpenFlag,
                pixelateFlag: pixelateFlag,
                ditherFlag: ditherFlag,

            };
            client.applyOperations(imageAdjustmentValues);
            ctx.putImageData(client.getImage(), 0, 0);
            props.setStatus('Ready');
        }, 200),
        [
            brightness,
            contrast,
            saturation,
            verticalFlipFlag,
            horizontalFlipFlag,
            sepiaFlag,
            invertFlag,
            greyscaleMethod,
            blurFlag,
            sharpenFlag,
            pixelateFlag,
            ditherFlag,
            props.canvasRef,
            props.imageLoaded
        ]
    );

    useEffect(() => {
        if(!props.imageLoaded) {
            resetAllChanges();
        }
    }, [props.imageLoaded]);

    useEffect(() => {
            applyAdjustments();
            return () => applyAdjustments.cancel(); // Cleanup function to prevent unnecessary calls
        },
        [
            brightness,
            contrast,
            saturation,
            verticalFlipFlag,
            horizontalFlipFlag,
            sepiaFlag,
            invertFlag,
            greyscaleMethod,
            blurFlag,
            sharpenFlag,
            pixelateFlag,
            ditherFlag,
            applyAdjustments
        ]
    );

    return (
        <>
            <Paper shadow="sm" p="md">
                <Stack>
                    <Group justify="flex-end" grow>
                        <Button leftSection={<IconArrowBackUp size={14}/>}
                                onClick={resetAllChanges}
                                disabled={!props.imageLoaded}
                        >
                            Reset
                        </Button>
                    </Group>
                    <Title order={6}>Brightness: {Math.ceil(brightness / 255 * 100)}%</Title>
                    <Slider value={brightness} onChange={setBrightness} min={-255} max={255} step={1}
                            label={null}
                            disabled={!props.imageLoaded}
                    />
                    <Title order={6}>Contrast: {Math.ceil(contrast / 255 * 100)}%</Title>
                    <Slider value={contrast} onChange={setContrast} min={-255} max={255} step={1}
                            label={null}
                            disabled={!props.imageLoaded}
                    />
                    <Title order={6}>Saturation: {saturation}%</Title>
                    <Slider value={saturation} onChange={setSaturation} min={-100} max={100} step={1}
                            label={null}
                            disabled={!props.imageLoaded}
                    />
                    <Title order={6}>Flip:</Title>
                    <Group justify="flex-end" grow>
                        <Button
                            onClick={() => setVerticalFlipFlag(!verticalFlipFlag)}
                            variant={verticalFlipFlag ? 'filled' : 'outline'}
                            style={{ textAlign: 'center', height: 'auto', padding: '8px' }}
                            disabled={!props.imageLoaded}
                        >
                            Vertically
                        </Button>
                        <Button
                            onClick={() => setHorizontalFlipFlag(!horizontalFlipFlag)}
                            variant={horizontalFlipFlag ? 'filled' : 'outline'}
                            style={{ textAlign: 'center', height: 'auto', padding: '8px' }}
                            disabled={!props.imageLoaded}
                        >
                            Horizontally
                        </Button>
                    </Group>
                    <Title order={6}>Color Transformation:</Title>
                    <Button
                        onClick={() => setSepiaFlag(!sepiaFlag)}
                        variant={sepiaFlag ? 'filled' : 'outline'}
                        disabled={!props.imageLoaded}
                    >
                        Sepia
                    </Button>
                    <Button
                        onClick={() => setInvertFlag(!invertFlag)}
                        variant={invertFlag ? 'filled' : 'outline'}
                        disabled={!props.imageLoaded}
                    >
                        Invert
                    </Button>
                    <Title order={6}>Greyscale:</Title>
                    <ButtonGroup>
                        <Button
                            onClick={() => toggleGrayscale('value')}
                            variant={(greyscaleMethod === 'value') ? 'filled' : 'outline'}
                            style={{ textAlign: 'center', height: 'auto', padding: '8px' }}
                            fullWidth
                            disabled={!props.imageLoaded}
                        >
                            Value
                        </Button>
                        <Button
                            onClick={() => toggleGrayscale('luma')}
                            variant={(greyscaleMethod === 'luma') ? 'filled' : 'outline'}
                            style={{ textAlign: 'center', height: 'auto', padding: '8px' }}
                            fullWidth
                            disabled={!props.imageLoaded}
                        >
                            Luma
                        </Button>
                        <Button
                            onClick={() => toggleGrayscale('intensity')}
                            variant={(greyscaleMethod === 'intensity') ? 'filled' : 'outline'}
                            style={{ textAlign: 'center', height: 'auto', padding: '8px' }}
                            fullWidth
                            disabled={!props.imageLoaded}
                        >
                            Balance
                        </Button>
                    </ButtonGroup>
                    <Title order={6}>Filters:</Title>
                    <Grid grow gutter="xs">
                        <Grid.Col span={6}>
                            <Button
                                fullWidth={true}
                                onClick={() => setBlurFlag(!blurFlag)}
                                variant={blurFlag ? 'filled' : 'outline'}
                                disabled={!props.imageLoaded}
                            >
                                Blur
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Button
                                onClick={() => setSharpenFlag(!sharpenFlag)}
                                variant={sharpenFlag ? 'filled' : 'outline'}
                                fullWidth={true}
                                disabled={!props.imageLoaded}
                            >
                                Sharpen
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Button
                                fullWidth={true}
                                onClick={() => setPixelateFlag(!pixelateFlag)}
                                variant={pixelateFlag ? 'filled' : 'outline'}
                                disabled={!props.imageLoaded}
                            >
                                Pixelate
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Button
                                onClick={() => setDitherFlag(!ditherFlag)}
                                variant={ditherFlag ? 'filled' : 'outline'}
                                fullWidth={true}
                                disabled={!props.imageLoaded}
                            >
                                Dither
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Paper>
        </>
    );
}