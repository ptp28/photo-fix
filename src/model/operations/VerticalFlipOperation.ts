import ImageInterface from "../ImageInterface.ts";
import {ImageChannel} from "../ImageChannel.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class VerticalFlipOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const h = rgbImage.getHeight();
        return rgbImage.map((_r, _g, _b, x, y) => [
            rgbImage.get(x, h - 1 - y, ImageChannel.RED),
            rgbImage.get(x, h - 1 - y, ImageChannel.GREEN),
            rgbImage.get(x, h - 1 - y, ImageChannel.BLUE)
        ]);
    }
}
