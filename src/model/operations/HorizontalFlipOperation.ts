import ImageInterface from "../ImageInterface.ts";
import {ImageChannel} from "../ImageChannel.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class HorizontalFlipOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const w = rgbImage.getWidth();
        return rgbImage.map((_r, _g, _b, x, y) => [
            rgbImage.get(w - 1 - x, y, ImageChannel.RED),
            rgbImage.get(w - 1 - x, y, ImageChannel.GREEN),
            rgbImage.get(w - 1 - x, y, ImageChannel.BLUE)
        ]);
    }
}
