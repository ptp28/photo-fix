import {ImageChannel} from "../src/model/ImageChannel";
import RGBImage from "../src/model/RGBImage";
import ImageInterface from "../src/model/ImageInterface";

describe('RGBImage', () => {

    let image: ImageInterface;
    beforeEach(() => {
        image = new RGBImage(3, 2);
    });

    test('constructor initializes dimensions and pixels correctly', () => {
        expect(image.getWidth()).toBe(3);
        expect(image.getHeight()).toBe(2);

        // Check all pixels are initialized to 0
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 3; x++) {
                expect(image.get(x, y, ImageChannel.RED)).toBe(0);
                expect(image.get(x, y, ImageChannel.GREEN)).toBe(0);
                expect(image.get(x, y, ImageChannel.BLUE)).toBe(0);
            }
        }
    });

    test('get and set methods work correctly', () => {
        const image = new RGBImage(2, 2);

        // Set some pixel values
        image.set(0, 0, ImageChannel.RED, 255);
        image.set(1, 1, ImageChannel.GREEN, 128);
        image.set(1, 0, ImageChannel.BLUE, 64);

        // Verify the pixel values
        expect(image.get(0, 0, ImageChannel.RED)).toBe(255);
        expect(image.get(1, 1, ImageChannel.GREEN)).toBe(128);
        expect(image.get(1, 0, ImageChannel.BLUE)).toBe(64);
    });

    test('throws error for invalid dimensions', () => {
        expect(() => new RGBImage(-1, 5)).toThrow('Width must be positive');
        expect(() => new RGBImage(5, -1)).toThrow('Height must be positive');
        expect(() => new RGBImage(0, 0)).toThrow('Width must be positive');
    });

    test('throws error for out-of-bounds coordinates in get', () => {
        expect(() => image.get(-1, 0, ImageChannel.RED)).toThrow('Error: Invalid location (-1,0) of pixel in get. Dimensions of image are 3x2');
        expect(() => image.get(3, 0, ImageChannel.RED)).toThrow('Error: Invalid location (3,0) of pixel in get. Dimensions of image are 3x2');
        expect(() => image.get(0, 2, ImageChannel.RED)).toThrow('Error: Invalid location (0,2) of pixel in get. Dimensions of image are 3x2');
    });

    test('throws error for out-of-bounds coordinates in set', () => {
        expect(() => image.set(-1, 0, ImageChannel.RED, 100)).toThrow('Error: Invalid location (-1,0) of pixel in set');
        expect(() => image.set(3, 0, ImageChannel.RED, 100)).toThrow('Error: Invalid location (3,0) of pixel in set');
        expect(() => image.set(0, 2, ImageChannel.RED, 100)).toThrow('Error: Invalid location (0,2) of pixel in set');
    });

    test('throws error for invalid pixel values in set', () => {
        expect(() => image.set(1, 1, ImageChannel.RED, -1)).toThrow('Error: Value must be in the range 0-255');
        expect(() => image.set(1, 1, ImageChannel.RED, 256)).toThrow('Error: Value must be in the range 0-255');
    });

    test('correctly handles edge cases for the last pixel', () => {
        // Set and get values for the last pixel
        image.set(2, 1, ImageChannel.BLUE, 150);
        expect(image.get(2, 1, ImageChannel.BLUE)).toBe(150);
    });
});