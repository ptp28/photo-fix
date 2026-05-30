import ImageInterface from "../ImageInterface.ts";
import {ImageChannel} from "../ImageChannel.ts";
import RGBImage from "../RGBImage.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class DitherOperation implements ImageOperation {
    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const width = rgbImage.getWidth();
        const height = rgbImage.getHeight();
        const newImage = new RGBImage(width, height);

        const size = width * height;
        const tempGreys = new Float32Array(size);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const r = rgbImage.get(x, y, ImageChannel.RED);
                const g = rgbImage.get(x, y, ImageChannel.GREEN);
                const b = rgbImage.get(x, y, ImageChannel.BLUE);
                tempGreys[y * width + x] = 0.299 * r + 0.587 * g + 0.114 * b;
            }
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                const oldPixel = tempGreys[idx];
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                newImage.set(x, y, ImageChannel.RED, newPixel);
                newImage.set(x, y, ImageChannel.GREEN, newPixel);
                newImage.set(x, y, ImageChannel.BLUE, newPixel);

                if (x + 1 < width) {
                    tempGreys[idx + 1] += error * 7 / 16;
                }
                if (y + 1 < height) {
                    const rowOffset = (y + 1) * width;
                    if (x > 0) {
                        tempGreys[rowOffset + (x - 1)] += error * 3 / 16;
                    }
                    tempGreys[rowOffset + x] += error * 5 / 16;
                    if (x + 1 < width) {
                        tempGreys[rowOffset + (x + 1)] += error / 16;
                    }
                }
            }
        }

        return newImage;
    }
}
