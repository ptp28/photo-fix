import ImageManipulatorController from "../controller/ImageManipulatorController.ts";

export interface IImageAdjustmentsValues {
    brightness: number;
    contrast: number;
    saturation: number;
    verticalFlipFlag: boolean;
    horizontalFlipFlag: boolean;
    sepiaFlag: boolean;
    invertFlag: boolean;
    greyscaleMethod: 'value' | 'luma' | 'intensity' | undefined;
    blurFlag: boolean;
    sharpenFlag: boolean;
    pixelateFlag: boolean;
    ditherFlag: boolean;
}

class ImageManipulatorClient {
    private _controllerObject: ImageManipulatorController;
    private originalImageName: string;
    private workingImageName: string;
    private imageChangeCallbacks: Function[];

    constructor() {
        this._controllerObject = new ImageManipulatorController();
        this.originalImageName = "original_image";
        this.workingImageName = "operating_image";
        this.imageChangeCallbacks = [];
    }

    addOnImageAdjustmentChangeCallback(callback: Function) {
        if (!this.imageChangeCallbacks.includes(callback)) {
            this.imageChangeCallbacks.push(callback);
        }
    }

    loadImage(imageData: ImageData) {
        this._controllerObject.loadImage(imageData, this.originalImageName);
    }

    applyOperations(imageAdjustmentValues: IImageAdjustmentsValues) {
        const originalImage = this._controllerObject.saveImage(this.originalImageName);
        this._controllerObject.loadImage(originalImage, this.workingImageName);
        if (imageAdjustmentValues.brightness != 0) {
            this._controllerObject.adjustImageBrightness(imageAdjustmentValues.brightness, this.workingImageName, this.workingImageName);
        }
        if (imageAdjustmentValues.contrast != 0) {
            this._controllerObject.adjustImageContrast(imageAdjustmentValues.contrast, this.workingImageName, this.workingImageName);
        }
        if (imageAdjustmentValues.saturation != 0) {
            this._controllerObject.adjustImageSaturation(imageAdjustmentValues.saturation, this.workingImageName, this.workingImageName);
        }
        if (imageAdjustmentValues.verticalFlipFlag) {
            this._controllerObject.verticalFlip(this.workingImageName, this.workingImageName);
        }
        if (imageAdjustmentValues.horizontalFlipFlag) {
            this._controllerObject.horizontalFlip(this.workingImageName, this.workingImageName);
        }
        switch (imageAdjustmentValues.greyscaleMethod) {
            case 'value':
                this._controllerObject.adjustGreyscaleValue(this.workingImageName, this.workingImageName);
                break;
            case 'luma':
                this._controllerObject.adjustGreyscaleLuma(this.workingImageName, this.workingImageName);
                break;
            case 'intensity':
                this._controllerObject.adjustGreyscaleIntensity(this.workingImageName, this.workingImageName);
                break;
        }
        if(imageAdjustmentValues.pixelateFlag) {
            this._controllerObject.pixelateImage(this.workingImageName, this.workingImageName)
        }
        if(imageAdjustmentValues.ditherFlag) {
            this._controllerObject.ditherImage(this.workingImageName, this.workingImageName)
        }
        if(imageAdjustmentValues.blurFlag) {
            this._controllerObject.blurImage(this.workingImageName, this.workingImageName);
        }
        if(imageAdjustmentValues.sharpenFlag) {
            this._controllerObject.sharpenImage(this.workingImageName, this.workingImageName);
        }
        if(imageAdjustmentValues.sepiaFlag) {
            this._controllerObject.applySepia(this.workingImageName, this.workingImageName);
        }
        if(imageAdjustmentValues.invertFlag) {
            this._controllerObject.invertImage(this.workingImageName, this.workingImageName);
        }

        this.imageChangeCallbacks.forEach(callback => {
            callback();
        });
    }

    getImage() {
        return this._controllerObject.saveImage(this.workingImageName);
    }

    getImageHistogramData() {
        return this._controllerObject.getImageHistogramData(this.workingImageName);
    }
}

const client = new ImageManipulatorClient();
export default client;