import {ImageChannel} from "../src/model/ImageChannel";
import RGBImage from "../src/model/RGBImage";
import {
    BrightnessOperation,
    ContrastOperation,
    SepiaOperation,
    InvertOperation,
    GreyscaleLumaOperation,
    VerticalFlipOperation,
    HorizontalFlipOperation
} from "../src/model/operations/index";

describe('ImageOperations', () => {
    let image: RGBImage;

    beforeEach(() => {
        // 2x1 image: left pixel = (100, 150, 200), right pixel = (50, 80, 120)
        image = new RGBImage(2, 1);
        image.set(0, 0, ImageChannel.RED, 100);
        image.set(0, 0, ImageChannel.GREEN, 150);
        image.set(0, 0, ImageChannel.BLUE, 200);
        image.set(1, 0, ImageChannel.RED, 50);
        image.set(1, 0, ImageChannel.GREEN, 80);
        image.set(1, 0, ImageChannel.BLUE, 120);
    });

    test('BrightnessOperation increases pixel values', () => {
        const result = image.apply(new BrightnessOperation(50));
        expect(result.get(0, 0, ImageChannel.RED)).toBe(150);
        expect(result.get(0, 0, ImageChannel.GREEN)).toBe(200);
        expect(result.get(0, 0, ImageChannel.BLUE)).toBe(250);
    });

    test('BrightnessOperation clamps at 255', () => {
        const result = image.apply(new BrightnessOperation(200));
        expect(result.get(0, 0, ImageChannel.BLUE)).toBe(255);
    });

    test('BrightnessOperation clamps at 0', () => {
        const result = image.apply(new BrightnessOperation(-200));
        expect(result.get(1, 0, ImageChannel.RED)).toBe(0);
    });

    test('InvertOperation inverts all channels', () => {
        const result = image.apply(new InvertOperation());
        expect(result.get(0, 0, ImageChannel.RED)).toBe(155);
        expect(result.get(0, 0, ImageChannel.GREEN)).toBe(105);
        expect(result.get(0, 0, ImageChannel.BLUE)).toBe(55);
    });

    test('GreyscaleLumaOperation produces equal R, G, B channels', () => {
        const result = image.apply(new GreyscaleLumaOperation());
        const r = result.get(0, 0, ImageChannel.RED);
        const g = result.get(0, 0, ImageChannel.GREEN);
        const b = result.get(0, 0, ImageChannel.BLUE);
        expect(r).toBe(g);
        expect(g).toBe(b);
    });

    test('VerticalFlipOperation flips rows', () => {
        const tall = new RGBImage(1, 2);
        tall.set(0, 0, ImageChannel.RED, 10);
        tall.set(0, 1, ImageChannel.RED, 20);
        const result = tall.apply(new VerticalFlipOperation());
        expect(result.get(0, 0, ImageChannel.RED)).toBe(20);
        expect(result.get(0, 1, ImageChannel.RED)).toBe(10);
    });

    test('HorizontalFlipOperation flips columns', () => {
        const result = image.apply(new HorizontalFlipOperation());
        expect(result.get(0, 0, ImageChannel.RED)).toBe(50);
        expect(result.get(1, 0, ImageChannel.RED)).toBe(100);
    });

    test('operations do not mutate the original image', () => {
        image.apply(new BrightnessOperation(100));
        expect(image.get(0, 0, ImageChannel.RED)).toBe(100); // unchanged
    });
});
