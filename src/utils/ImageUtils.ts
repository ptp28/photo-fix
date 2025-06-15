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
        const rgbImage = new RGBImage(imageData.width, imageData.height);
        let x = 0;
        let y = 0;
        // Populate the RGBImage object with pixel data
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];

            rgbImage.set(x, y, ImageChannel.RED, r);
            rgbImage.set(x, y, ImageChannel.GREEN, g);
            rgbImage.set(x, y, ImageChannel.BLUE, b);

            x++;
            if(x === imageData.width) {
                x = 0;
                y++;
            }
        }
        return rgbImage;
    }

    public static saveImageData(image: ImageInterface) {
        const imageDataArray = new Uint8ClampedArray(image.getWidth() * image.getHeight() * 4);

        for (let y = 0; y < image.getHeight(); y++) {
            for (let x = 0; x < image.getWidth(); x++) {
                const pixelIndex = y * image.getWidth() + x;
                const rgbaIndex = pixelIndex * 4;

                // Set RGBA values (Assume grayscale: R = G = B = pixelValue, full alpha)
                imageDataArray[rgbaIndex] = image.get(x, y, ImageChannel.RED); // Red
                imageDataArray[rgbaIndex + 1] = image.get(x, y, ImageChannel.GREEN); // Green
                imageDataArray[rgbaIndex + 2] = image.get(x, y, ImageChannel.BLUE); // Blue
                imageDataArray[rgbaIndex + 3] = 255; // Alpha (fully opaque)
            }
        }

        return new ImageData(imageDataArray, image.getWidth(), image.getHeight());
    }
}