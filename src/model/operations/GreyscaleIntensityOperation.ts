import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class GreyscaleIntensityOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => {
            const avg = Math.round((r + g + b) / 3);
            return [avg, avg, avg];
        });
    }
}
