import type { ImageOperation } from "./operations/ImageOperation.ts";

export default interface ImageInterface {
    get(x: number, y: number, channel: number): number;
    getWidth(): number;
    getHeight(): number;
    apply(operation: ImageOperation): ImageInterface;
}