import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class BrightnessOperation implements ImageOperation {
    constructor(private readonly value: number) {}

    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => [
            Math.max(0, Math.min(r + this.value, 255)),
            Math.max(0, Math.min(g + this.value, 255)),
            Math.max(0, Math.min(b + this.value, 255))
        ]);
    }
}
