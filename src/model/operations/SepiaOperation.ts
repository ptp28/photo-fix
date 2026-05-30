import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class SepiaOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => [
            Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189))),
            Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168))),
            Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)))
        ]);
    }
}
