import {ImageChannel} from "./ImageChannel.ts";
import ImageInterface from "./ImageInterface.ts";

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

    /**
     * Map helper to eliminate loop boilerplate across point-based filters.
     * Iterates sequentially over the flat array and applies a transformation callback.
     */
    public map(
        transformer: (r: number, g: number, b: number, x: number, y: number) => [number, number, number]
    ): RGBImage {
        const size = this._width * this._height * 3;
        const newPixels = new Uint8ClampedArray(size);

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const idx = (y * this._width + x) * 3;
                const r = this._pixels[idx];
                const g = this._pixels[idx + 1];
                const b = this._pixels[idx + 2];
                const [nr, ng, nb] = transformer(r, g, b, x, y);
                newPixels[idx] = nr;
                newPixels[idx + 1] = ng;
                newPixels[idx + 2] = nb;
            }
        }

        return new RGBImage(this._width, this._height, newPixels);
    }

    adjustBrightness(value: number): ImageInterface {
        return this.map((r, g, b) => [
            Math.max(0, Math.min(r + value, 255)),
            Math.max(0, Math.min(g + value, 255)),
            Math.max(0, Math.min(b + value, 255))
        ]);
    }

    adjustContrast(value: number): ImageInterface {
        const factor = (259 * (value + 255)) / (255 * (259 - value));
        return this.map((r, g, b) => [
            Math.max(0, Math.min(factor * (r - 128) + 128, 255)),
            Math.max(0, Math.min(factor * (g - 128) + 128, 255)),
            Math.max(0, Math.min(factor * (b - 128) + 128, 255))
        ]);
    }

    adjustSaturation(value: number): ImageInterface {
        return this.map((r, g, b) => {
            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;
            // Convert RGB to HSL
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            const l = (max + min) / 2;
            let s = 0;
            let h = 0;
            if (max !== min) {
                const d = max - min;
                s = d / (1 - Math.abs(2 * l - 1));
                if (max === rNorm) {
                    h = ((gNorm - bNorm) / d) % 6;
                } else if (max === gNorm) {
                    h = (bNorm - rNorm) / d + 2;
                } else {
                    h = (rNorm - gNorm) / d + 4;
                }

                h *= 60;
                if (h < 0) h += 360;
            }
            // Adjust saturation
            s = Math.max(0, Math.min(s * (1 + value / 100), 1));
            // Convert HSL back to RGB
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x1 = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - c / 2;
            let r1 = 0, g1 = 0, b1 = 0;
            if (h < 60) {
                r1 = c; g1 = x1; b1 = 0;
            } else if (h < 120) {
                r1 = x1; g1 = c; b1 = 0;
            } else if (h < 180) {
                r1 = 0; g1 = c; b1 = x1;
            } else if (h < 240) {
                r1 = 0; g1 = x1; b1 = c;
            } else if (h < 300) {
                r1 = x1; g1 = 0; b1 = c;
            } else {
                r1 = c; g1 = 0; b1 = x1;
            }
            // Scale back to 0-255
            return [
                Math.max(0, Math.min((r1 + m) * 255, 255)),
                Math.max(0, Math.min((g1 + m) * 255, 255)),
                Math.max(0, Math.min((b1 + m) * 255, 255))
            ];
        });
    }

    verticalFlip(): ImageInterface {
        const h = this._height;
        return this.map((_r, _g, _b, x, y) => [
            this.get(x, h - 1 - y, ImageChannel.RED),
            this.get(x, h - 1 - y, ImageChannel.GREEN),
            this.get(x, h - 1 - y, ImageChannel.BLUE)
        ]);
    }

    horizontalFlip(): ImageInterface {
        const w = this._width;
        return this.map((_r, _g, _b, x, y) => [
            this.get(w - 1 - x, y, ImageChannel.RED),
            this.get(w - 1 - x, y, ImageChannel.GREEN),
            this.get(w - 1 - x, y, ImageChannel.BLUE)
        ]);
    }

    greyscaleIntensity(): ImageInterface {
        return this.map((r, g, b) => {
            const avg = Math.round((r + g + b) / 3);
            return [avg, avg, avg];
        });
    }

    greyscaleLuma(): ImageInterface {
        return this.map((r, g, b) => {
            const luma = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            return [luma, luma, luma];
        });
    }

    greyscaleValue(): ImageInterface {
        return this.map((r, g, b) => {
            const value = Math.max(r, g, b);
            return [value, value, value];
        });
    }

    pixelate(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        const blockSize = 10;
        for (let x = 0; x < this._width; x += blockSize) {
            for (let y = 0; y < this._height; y += blockSize) {
                let sumR = 0;
                let sumG = 0;
                let sumB = 0;
                let count = 0;
                for (let i = x; i < Math.min(x + blockSize, this._width); i++) {
                    for (let j = y; j < Math.min(y + blockSize, this._height); j++) {
                        sumR += this.get(i, j, ImageChannel.RED);
                        sumG += this.get(i, j, ImageChannel.GREEN);
                        sumB += this.get(i, j, ImageChannel.BLUE);
                        count++;
                    }
                }
                const avgR = Math.round(sumR / count);
                const avgG = Math.round(sumG / count);
                const avgB = Math.round(sumB / count);
                for (let i = x; i < Math.min(x + blockSize, this._width); i++) {
                    for (let j = y; j < Math.min(y + blockSize, this._height); j++) {
                        newImage.set(i, j, ImageChannel.RED, avgR);
                        newImage.set(i, j, ImageChannel.GREEN, avgG);
                        newImage.set(i, j, ImageChannel.BLUE, avgB);
                    }
                }
            }
        }
        return newImage;
    }

    dither(): ImageInterface {
        // Floyd-Steinberg dithering for greyscale (flat 1D helper representation)
        const newImage = new RGBImage(this._width, this._height);

        const size = this._width * this._height;
        const tempGreys = new Float32Array(size);
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const r = this.get(x, y, ImageChannel.RED);
                const g = this.get(x, y, ImageChannel.GREEN);
                const b = this.get(x, y, ImageChannel.BLUE);
                tempGreys[y * this._width + x] = 0.299 * r + 0.587 * g + 0.114 * b;
            }
        }

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const idx = y * this._width + x;
                const oldPixel = tempGreys[idx];
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                newImage.set(x, y, ImageChannel.RED, newPixel);
                newImage.set(x, y, ImageChannel.GREEN, newPixel);
                newImage.set(x, y, ImageChannel.BLUE, newPixel);

                // Distribute the error to neighboring pixels
                // Floyd-Steinberg weights:
                //     *    7
                // 3   5   1
                if (x + 1 < this._width) {
                    tempGreys[idx + 1] += error * 7 / 16;
                }
                if (y + 1 < this._height) {
                    const rowOffset = (y + 1) * this._width;
                    if (x > 0) {
                        tempGreys[rowOffset + (x - 1)] += error * 3 / 16;
                    }
                    tempGreys[rowOffset + x] += error * 5 / 16;
                    if (x + 1 < this._width) {
                        tempGreys[rowOffset + (x + 1)] += error / 16;
                    }
                }
            }
        }

        return newImage;
    }

    blur(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        const kernel = [
            [1/25, 1/25, 1/25, 1/25, 1/25],
            [1/25, 1/25, 1/25, 1/25, 1/25],
            [1/25, 1/25, 1/25, 1/25, 1/25],
            [1/25, 1/25, 1/25, 1/25, 1/25],
            [1/25, 1/25, 1/25, 1/25, 1/25]
        ];

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                for (let channel = 0; channel < 3; channel++) {
                    let sum = 0;
                    for (let ky = -2; ky <= 2; ky++) {
                        for (let kx = -2; kx <= 2; kx++) {
                            const nx = x + kx;
                            const ny = y + ky;
                            if (nx >= 0 && nx < this._width && ny >= 0 && ny < this._height) {
                                sum += this.get(nx, ny, channel) * kernel[ky + 2][kx + 2];
                            }
                        }
                    }
                    newImage.set(x, y, channel, Math.round(sum));
                }
            }
        }
        return newImage;
    }

    sharpen(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        const kernel = [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ];

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                for (let channel = 0; channel < 3; channel++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const nx = x + kx;
                            const ny = y + ky;
                            if (nx >= 0 && nx < this._width && ny >= 0 && ny < this._height) {
                                sum += this.get(nx, ny, channel) * kernel[ky + 1][kx + 1];
                            }
                        }
                    }
                    sum = Math.max(0, Math.min(255, Math.round(sum)));
                    newImage.set(x, y, channel, sum);
                }
            }
        }
        return newImage;
    }

    sepia(): ImageInterface {
        return this.map((r, g, b) => {
            const newR = Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189)));
            const newG = Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168)));
            const newB = Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)));
            return [newR, newG, newB];
        });
    }

    invert(): ImageInterface {
        return this.map((r, g, b) => [255 - r, 255 - g, 255 - b]);
    }
}
