import {ImageChannel} from "./ImageChannel.ts";
import ImageInterface from "./ImageInterface.ts";
import type {ImageOperation} from "./operations/ImageOperation.ts";

export default class RGBImage implements ImageInterface {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _pixels: Uint8ClampedArray;

    constructor(width: number, height: number, pixels?: Uint8ClampedArray) {
        if (width < 1) {
            throw new Error("Width must be positive");
        }
        if (height < 1) {
            throw new Error("Height must be positive");
        }

        this._width = width;
        this._height = height;
        this._pixels = pixels ? pixels : new Uint8ClampedArray(width * height * 3);
    }

    get(x: number, y: number, channel: ImageChannel): number {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            throw new Error(
                `Error: Invalid location (${x},${y}) of pixel in get. Dimensions of image are ${this._width}x${this._height}`
            );
        }

        return this._pixels[(y * this._width + x) * 3 + channel];
    }

    set(x: number, y: number, channel: ImageChannel, value: number): void {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            throw new Error(`Error: Invalid location (${x},${y}) of pixel in set`);
        }
        if (value < 0 || value > 255) {
            throw new Error(`Error: Value must be in the range 0-255`);
        }

        this._pixels[(y * this._width + x) * 3 + channel] = value;
    }

    getWidth(): number {
        return this._width;
    }

    getHeight(): number {
        return this._height;
    }

    getRawPixels(): Uint8ClampedArray {
        return this._pixels;
    }

    apply(operation: ImageOperation): ImageInterface {
        return operation.apply(this);
    }

    /**
     * Generic pixel mapping helper.
     * Iterates sequentially over the flat array and applies a transformation callback
     * to each (r, g, b) triplet, returning a new RGBImage.
     */
    public map(
        transformer: (r: number, g: number, b: number, x: number, y: number) => [number, number, number]
    ): RGBImage {
        const newPixels = new Uint8ClampedArray(this._width * this._height * 3);

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const idx = (y * this._width + x) * 3;
                const [nr, ng, nb] = transformer(
                    this._pixels[idx],
                    this._pixels[idx + 1],
                    this._pixels[idx + 2],
                    x, y
                );
                newPixels[idx]     = nr;
                newPixels[idx + 1] = ng;
                newPixels[idx + 2] = nb;
            }
        }

        return new RGBImage(this._width, this._height, newPixels);
    }
}
