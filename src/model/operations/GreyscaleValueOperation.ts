import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class GreyscaleValueOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => {
            const value = Math.max(r, g, b);
            return [value, value, value];
        });
    }
}
