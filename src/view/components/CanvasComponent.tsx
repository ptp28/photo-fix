import {Paper} from "@mantine/core";
import React, {RefObject, useEffect} from "react";

interface CanvasComponentProps {
    canvasRef: RefObject<HTMLCanvasElement | null>,
}

export default function CanvasComponent(props: CanvasComponentProps) {

    useEffect(() => {
        if(!props.canvasRef) {
            return;
        }
    }, []);

    return (
        <>
            <Paper shadow="sm" style={{
                border: "1px solid",
                borderRadius: "4px"
            }}>
                <canvas
                    ref={props.canvasRef}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                />
            </Paper>
        </>
    );
}