import {ImageChannel} from "./ImageChannel.ts";

export default interface ImageInterface {
    get(x: number, y: number, channel: ImageChannel): number;
    getWidth(): number;
    getHeight(): number;
    adjustBrightness(value: number): ImageInterface;
    adjustContrast(value: number): ImageInterface;
    adjustSaturation(value: number): ImageInterface;
    verticalFlip(): ImageInterface;
    horizontalFlip(): ImageInterface;
    greyscaleIntensity(): ImageInterface;
    greyscaleLuma(): ImageInterface;
    greyscaleValue(): ImageInterface;
    pixelate(): ImageInterface;
    dither(): ImageInterface;
    blur(): ImageInterface;
    sharpen(): ImageInterface;
    sepia(): ImageInterface;
    invert(): ImageInterface;
}