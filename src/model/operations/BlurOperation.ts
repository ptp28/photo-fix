import ImageInterface from "../ImageInterface.ts";
import {ImageChannel} from "../ImageChannel.ts";
import RGBImage from "../RGBImage.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class BlurOperation implements ImageOperation {
    private static readonly KERNEL = [
        [1/25, 1/25, 1/25, 1/25, 1/25],
        [1/25, 1/25, 1/25, 1/25, 1/25],
        [1/25, 1/25, 1/25, 1/25, 1/25],
        [1/25, 1/25, 1/25, 1/25, 1/25],
        [1/25, 1/25, 1/25, 1/25, 1/25]
    ];

    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const width = rgbImage.getWidth();
        const height = rgbImage.getHeight();
        const newImage = new RGBImage(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let channel = 0; channel < 3; channel++) {
                    let sum = 0;
                    for (let ky = -2; ky <= 2; ky++) {
                        for (let kx = -2; kx <= 2; kx++) {
                            const nx = x + kx;
                            const ny = y + ky;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                sum += rgbImage.get(nx, ny, channel) * BlurOperation.KERNEL[ky + 2][kx + 2];
                            }
                        }
                    }
                    newImage.set(x, y, channel, Math.round(sum));
                }
            }
        }
        return newImage;
    }
}
