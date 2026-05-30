import ImageUtils from "../utils/ImageUtils.ts";
import ImageManager from "../model/ImageManager.ts";
import {ImageManagerImpl} from "../model/ImageManagerImpl.ts";
import {
    BrightnessOperation,
    ContrastOperation,
    SaturationOperation,
    VerticalFlipOperation,
    HorizontalFlipOperation,
    GreyscaleIntensityOperation,
    GreyscaleValueOperation,
    GreyscaleLumaOperation,
    PixelateOperation,
    DitherOperation,
    BlurOperation,
    SharpenOperation,
    SepiaOperation,
    InvertOperation
} from "../model/operations/index.ts";

export default class ImageManipulatorController {

    private modelObject: ImageManager;

    constructor() {
        this.modelObject = new ImageManagerImpl();
    }

    loadImage(imageData: ImageData, identifier: string) {
        const image = ImageUtils.readImageData(imageData);
        this.modelObject.loadImage(image, identifier);
    }

    saveImage(identifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image == null) {
            throw Error('Image not found');
        }
        return ImageUtils.saveImageData(image);
    }

    getImage(identifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image == null) {
            throw Error('Image not found');
        }
        return image;
    }

    private applyOperation(identifier: string, newIdentifier: string, operation: import("../model/operations/ImageOperation.ts").ImageOperation) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            this.modelObject.loadImage(image.apply(operation), newIdentifier);
        }
    }

    adjustImageBrightness(value: number, identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new BrightnessOperation(value));
    }

    adjustImageContrast(value: number, identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new ContrastOperation(value));
    }

    adjustImageSaturation(value: number, identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new SaturationOperation(value));
    }

    verticalFlip(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new VerticalFlipOperation());
    }

    horizontalFlip(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new HorizontalFlipOperation());
    }

    adjustGreyscaleIntensity(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new GreyscaleIntensityOperation());
    }

    adjustGreyscaleValue(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new GreyscaleValueOperation());
    }

    adjustGreyscaleLuma(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new GreyscaleLumaOperation());
    }

    pixelateImage(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new PixelateOperation());
    }

    ditherImage(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new DitherOperation());
    }

    blurImage(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new BlurOperation());
    }

    sharpenImage(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new SharpenOperation());
    }

    applySepia(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new SepiaOperation());
    }

    invertImage(identifier: string, newIdentifier: string) {
        this.applyOperation(identifier, newIdentifier, new InvertOperation());
    }

    getImageHistogramData(identifier: string) {
        return this.modelObject.getImageHistogramData(identifier);
    }
}