import RGBImage from "../model/RGBImage.ts";
import ImageInterface from "../model/ImageInterface.ts";
import {ImageChannel} from "../model/ImageChannel.ts";

export default class ImageUtils {

    public static async readImageFile(file: File): Promise<ImageInterface> {
        if (!file || !file.type.startsWith("image/")) {
            throw new Error("Invalid file. Please select an image.");
        }

        // Step 1: Read the file as a data URL
        const dataURL = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result.toString());
                } else {
                    reject(new Error("FileReader result is null."));
                }
            };

            reader.onerror = () => {
                reject(new Error("Error reading file: " + reader.error?.message));
            };

            reader.readAsDataURL(file);
        });

        // Step 2: Create an HTMLImageElement
        const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.src = dataURL;

            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load image."));
        });

        // Step 3: Process the image
        try {
            // Create a canvas with the image's dimensions
            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            const context = canvas.getContext("2d")!;

            // Draw the image on the canvas
            context.drawImage(imageElement, 0, 0);

            // Get the image data from the canvas
            const imageData = context.getImageData(0, 0, imageElement.width, imageElement.height);

            return this.readImageData(imageData);
        } catch (error: any) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    public static readImageData(imageData: ImageData) {
        const width = imageData.width;
        const height = imageData.height;
        const size = width * height * 3;
        const pixels = new Uint8ClampedArray(size);

        let srcIdx = 0;
        let destIdx = 0;
        const len = width * height;
        for (let i = 0; i < len; i++) {
            pixels[destIdx] = imageData.data[srcIdx];
            pixels[destIdx + 1] = imageData.data[srcIdx + 1];
            pixels[destIdx + 2] = imageData.data[srcIdx + 2];
            srcIdx += 4;
            destIdx += 3;
        }

        return new RGBImage(width, height, pixels);
    }

    public static saveImageData(image: ImageInterface) {
        const width = image.getWidth();
        const height = image.getHeight();
        const imageDataArray = new Uint8ClampedArray(width * height * 4);

        if (image instanceof RGBImage) {
            const rawPixels = image.getRawPixels();
            let srcIdx = 0;
            let destIdx = 0;
            const len = width * height;
            for (let i = 0; i < len; i++) {
                imageDataArray[destIdx] = rawPixels[srcIdx];
                imageDataArray[destIdx + 1] = rawPixels[srcIdx + 1];
                imageDataArray[destIdx + 2] = rawPixels[srcIdx + 2];
                imageDataArray[destIdx + 3] = 255; // Alpha
                srcIdx += 3;
                destIdx += 4;
            }
        } else {
            // Fallback for non-RGBImage custom implementations
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const pixelIndex = y * width + x;
                    const rgbaIndex = pixelIndex * 4;

                    imageDataArray[rgbaIndex] = image.get(x, y, ImageChannel.RED);
                    imageDataArray[rgbaIndex + 1] = image.get(x, y, ImageChannel.GREEN);
                    imageDataArray[rgbaIndex + 2] = image.get(x, y, ImageChannel.BLUE);
                    imageDataArray[rgbaIndex + 3] = 255;
                }
            }
        }

        return new ImageData(imageDataArray, width, height);
    }
}