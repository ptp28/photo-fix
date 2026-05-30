import ImageInterface from "../ImageInterface.ts";
import RGBImage from "../RGBImage.ts";
import {ImageChannel} from "../ImageChannel.ts";

export interface ImageOperation {
    apply(image: ImageInterface): ImageInterface;
}

export function ensureRGBImage(image: ImageInterface): RGBImage {
    if (image instanceof RGBImage) {
        return image;
    }
    const width = image.getWidth();
    const height = image.getHeight();
    const result = new RGBImage(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            result.set(x, y, ImageChannel.RED, image.get(x, y, ImageChannel.RED));
            result.set(x, y, ImageChannel.GREEN, image.get(x, y, ImageChannel.GREEN));
            result.set(x, y, ImageChannel.BLUE, image.get(x, y, ImageChannel.BLUE));
        }
    }
    return result;
}
