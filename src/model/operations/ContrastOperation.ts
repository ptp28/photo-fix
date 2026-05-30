import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class ContrastOperation implements ImageOperation {
    constructor(private readonly value: number) {}

    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const factor = (259 * (this.value + 255)) / (255 * (259 - this.value));
        return rgbImage.map((r, g, b) => [
            Math.max(0, Math.min(factor * (r - 128) + 128, 255)),
            Math.max(0, Math.min(factor * (g - 128) + 128, 255)),
            Math.max(0, Math.min(factor * (b - 128) + 128, 255))
        ]);
    }
}
