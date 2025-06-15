import {ImageManagerImpl} from "../src/model/ImageManagerImpl";
import ImageManager from "../src/model/ImageManager";
import ImageInterface from "../src/model/ImageInterface";
import RGBImage from "../src/model/RGBImage";

describe("ImageManagerImpl", () => {
    let imageManager: ImageManager;

    beforeEach(() => {
        imageManager = new ImageManagerImpl();
    });

    test("should create a new image with valid dimensions and name", () => {
        imageManager.createImage(100, 200, "testImage");
        const image = imageManager.getImage("testImage");
        expect(image).not.toBeNull();
        expect(image?.getWidth()).toBe(100);
        expect(image?.getHeight()).toBe(200);
    });

    test("should throw an error when creating an image with negative dimensions", () => {
        expect(() => {
            imageManager.createImage(-100, 200, "testImage");
        }).toThrow("Error: Image of invalid dimensions (-100,200) cannot be created!");
    });

    test("should throw an error when creating an image without a name", () => {
        expect(() => {
            imageManager.createImage(100, 200, null as any);
        }).toThrow("Error: No name provided for new image.");
    });

    test("should load an image with a valid name", () => {
        const image: ImageInterface = new RGBImage(50, 50);
        imageManager.loadImage(image, "loadedImage");

        const loadedImage = imageManager.getImage("loadedImage");
        expect(loadedImage).toEqual(image);
    });

    test("should throw an error when loading a null image", () => {
        expect(() => {
            imageManager.loadImage(null as any, "nullImage");
        }).toThrow("Error: No image provided to be loaded into the model.");
    });

    test("should throw an error when loading an image without a name", () => {
        const image: ImageInterface = new RGBImage(50, 50);
        expect(() => {
            imageManager.loadImage(image, null as any);
        }).toThrow("Error: No name provided for the image to be loaded into the model.");
    });

    test("should remove an image by name", () => {
        imageManager.createImage(100, 100, "imageToRemove");
        imageManager.removeImage("imageToRemove");

        const removedImage = imageManager.getImage("imageToRemove");
        expect(removedImage).toBeNull();
    });

    test("should do nothing when removing an image that does not exist", () => {
        expect(() => {
            imageManager.removeImage("nonExistentImage");
        }).not.toThrow();
    });

    test("should throw an error when removing an image with a null name", () => {
        expect(() => {
            imageManager.removeImage(null as any);
        }).toThrow("Error: Name of the image to be removed is not specified.");
    });

    test("should retrieve an image by name", () => {
        const image: ImageInterface = new RGBImage(80, 60);
        imageManager.loadImage(image, "retrievedImage");

        const retrievedImage = imageManager.getImage("retrievedImage");
        expect(retrievedImage).toEqual(image);
    });

    test("should return null when retrieving an image that does not exist", () => {
        const nonExistentImage = imageManager.getImage("nonExistentImage");
        expect(nonExistentImage).toBeNull();
    });

    test("should throw an error when retrieving an image with a null name", () => {
        expect(() => {
            imageManager.getImage(null as any);
        }).toThrow("Error: Name of the image to be obtained is not specified.");
    });
});