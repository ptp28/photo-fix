import ImageInterface from "../ImageInterface.ts";
import {ImageChannel} from "../ImageChannel.ts";
import RGBImage from "../RGBImage.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class PixelateOperation implements ImageOperation {
    constructor(private readonly blockSize: number = 10) {}

    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        const width = rgbImage.getWidth();
        const height = rgbImage.getHeight();
        const newImage = new RGBImage(width, height);
        
        for (let x = 0; x < width; x += this.blockSize) {
            for (let y = 0; y < height; y += this.blockSize) {
                let sumR = 0, sumG = 0, sumB = 0, count = 0;
                
                const maxX = Math.min(x + this.blockSize, width);
                const maxY = Math.min(y + this.blockSize, height);

                for (let i = x; i < maxX; i++) {
                    for (let j = y; j < maxY; j++) {
                        sumR += rgbImage.get(i, j, ImageChannel.RED);
                        sumG += rgbImage.get(i, j, ImageChannel.GREEN);
                        sumB += rgbImage.get(i, j, ImageChannel.BLUE);
                        count++;
                    }
                }
                
                const avgR = Math.round(sumR / count);
                const avgG = Math.round(sumG / count);
                const avgB = Math.round(sumB / count);
                
                for (let i = x; i < maxX; i++) {
                    for (let j = y; j < maxY; j++) {
                        newImage.set(i, j, ImageChannel.RED, avgR);
                        newImage.set(i, j, ImageChannel.GREEN, avgG);
                        newImage.set(i, j, ImageChannel.BLUE, avgB);
                    }
                }
            }
        }
        return newImage;
    }
}
