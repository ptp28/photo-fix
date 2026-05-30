import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class GreyscaleLumaOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => {
            const luma = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            return [luma, luma, luma];
        });
    }
}
