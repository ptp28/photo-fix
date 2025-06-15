import ImageUtils from "../utils/ImageUtils.ts";
import ImageManager from "../model/ImageManager.ts";
import {ImageManagerImpl} from "../model/ImageManagerImpl.ts";

export default class ImageManipulatorController {

    modelObject: ImageManager;
    constructor() {
        this.modelObject = new ImageManagerImpl();
    }

    loadImage(imageData: ImageData, identifier: string) {
        const image = ImageUtils.readImageData(imageData);
        this.modelObject.loadImage(image, identifier);
    }

    saveImage(identifier: string) {
        const image = this.modelObject.getImage(identifier);
        if(image == null) {
            throw Error('Image not found');
        }
        return ImageUtils.saveImageData(image);
    }

    getImage(identifier: string) {
        const image = this.modelObject.getImage(identifier);
        if(image == null) {
            throw Error('Image not found');
        }
        return image;
    }

    adjustImageBrightness(value: number, identifier: string, newIdentifier: string) {
        // TODO: add error handling for value
        const image = this.modelObject.getImage(identifier);
        if(image != null) {
            const newImage = image.adjustBrightness(value);
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    adjustImageContrast(value: number, identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if(image != null) {
            const newImage = image.adjustContrast(value);
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    adjustImageSaturation(value: number, identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if(image != null) {
            const newImage = image.adjustSaturation(value);
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    verticalFlip(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if(image != null) {
            const newImage = image.verticalFlip();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    horizontalFlip(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.horizontalFlip();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    adjustGreyscaleIntensity(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.greyscaleIntensity();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    adjustGreyscaleValue(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.greyscaleValue();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    adjustGreyscaleLuma(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.greyscaleLuma();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    pixelateImage(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.pixelate();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    ditherImage(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.dither();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    blurImage(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.blur();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    sharpenImage(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.sharpen();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    applySepia(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.sepia();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    invertImage(identifier: string, newIdentifier: string) {
        const image = this.modelObject.getImage(identifier);
        if (image != null) {
            const newImage = image.invert();
            this.modelObject.loadImage(newImage, newIdentifier);
        }
    }

    getImageHistogramData(identifier: string) {
        return this.modelObject.getImageHistogramData(identifier);
    }
}