import ImageEditor from "./ImageEditor.tsx";
import React from "react"
import HeaderBar from "./HeaderBar.tsx";

export default function Window() {
    return (
        <>
            <HeaderBar/>
            <ImageEditor/>
        </>
    )
}