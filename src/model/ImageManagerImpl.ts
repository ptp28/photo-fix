import ImageInterface from "./ImageInterface.ts";
import ImageManager from "./ImageManager.ts";
import RGBImage from "./RGBImage.ts";
import {ImageChannel} from "./ImageChannel.ts";

export class ImageManagerImpl implements ImageManager {
    private images: Map<string, ImageInterface>;

    constructor() {
        this.images = new Map<string, ImageInterface>();
    }

    createImage(width: number, height: number, name: string) {
        if (width < 0 || height < 0) {
            throw new Error("Error: Image of invalid dimensions (" + width + "," + height + ") cannot be created!");
        }
        if (name == null) {
            throw new Error("Error: No name provided for new image.");
        }

        const newImage = new RGBImage(width, height);
        this.images.set(name, newImage);
    }

    loadImage(image: ImageInterface, name: string) {
        if (image == null) {
            throw new Error("Error: No image provided to be loaded into the model.");
        }
        if (name == null) {
            throw new Error("Error: No name provided for the image to be loaded into the model.");
        }
        this.images.set(name, image);
    }

    removeImage(name: string) {
        if (name == null) {
            throw new Error("Error: Name of the image to be removed is not specified.");
        }
        this.images.delete(name);
    }

    getImage(name: string): ImageInterface | null {
        if (name == null) {
            throw new Error("Error: Name of the image to be obtained is not specified.");
        }
        return this.images.get(name) || null;
    }

    getImageHistogramData(name: string): number[][] {
        if (name == null) {
            throw new Error("Error: Name of the image to get histogram is not specified.");
        }

        const image = this.getImage(name);
        if (image === null) {
            throw new Error("Error: Image not found.");
        }

        // Initialize histograms for R, G, B channels - simplified structure
        const histograms: number[][] = [
            new Array(256).fill(0), // Red channel
            new Array(256).fill(0), // Green channel
            new Array(256).fill(0)  // Blue channel
        ];

        // Count frequency of each value in each channel
        for (let y = 0; y < image.getHeight(); y++) {
            for (let x = 0; x < image.getWidth(); x++) {
                const redValue = image.get(x, y, ImageChannel.RED);
                const greenValue = image.get(x, y, ImageChannel.GREEN);
                const blueValue = image.get(x, y, ImageChannel.BLUE);

                histograms[0][redValue]++;   // Red
                histograms[1][greenValue]++; // Green
                histograms[2][blueValue]++;  // Blue
            }
        }

        return histograms;
    }
}