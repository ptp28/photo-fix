import {ImageChannel} from "./ImageChannel.ts";
import ImageInterface from "./ImageInterface.ts";

export default class RGBImage implements ImageInterface {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _pixels: number[][][];

    constructor(width: number, height: number, pixels?: number[][][]) {
        if (width < 1) {
            throw new Error("Width must be positive");
        }
        if (height < 1) {
            throw new Error("Height must be positive");
        }

        this._width = width;
        this._height = height;
        this._pixels = pixels ?
            pixels.map(row => row.map(col => [...col]))
            : Array.from({length: height}, () => Array.from({length: width}, () => [0, 0, 0]));
    }

    get(x: number, y: number, channel: ImageChannel): number {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            throw new Error(
                `Error: Invalid location (${x},${y}) of pixel in get. Dimensions of image are ${this._width}x${this._height}`
            );
        }

        return this._pixels[y][x][channel];
    }

    set(x: number, y: number, channel: ImageChannel, value: number): void {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            throw new Error(`Error: Invalid location (${x},${y}) of pixel in set`);
        }
        if (value < 0 || value > 255) {
            throw new Error(`Error: Value must be in the range 0-255`);
        }

        this._pixels[y][x][channel] = value;
    }

    getWidth(): number {
        return this._width;
    }

    getHeight(): number {
        return this._height;
    }

    adjustBrightness(value: number): ImageInterface {
        const newImage = new RGBImage(this._width, this._height, this._pixels);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                newImage.set(x, y, ImageChannel.RED, Math.max(0, Math.min(this.get(x, y, ImageChannel.RED) + value, 255)));
                newImage.set(x, y, ImageChannel.GREEN, Math.max(0, Math.min(this.get(x, y, ImageChannel.GREEN) + value, 255)));
                newImage.set(x, y, ImageChannel.BLUE, Math.max(0, Math.min(this.get(x, y, ImageChannel.BLUE) + value, 255)));
            }
        }
        return newImage;
    }

    adjustContrast(value: number): ImageInterface {
        const newImage = new RGBImage(this._width, this._height, this._pixels);
        let factor = (259 * (value + 255)) / (255 * (259 - value));
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                newImage.set(x, y, ImageChannel.RED, Math.max(0, Math.min(factor * (this.get(x, y, ImageChannel.RED) - 128) + 128, 255)));
                newImage.set(x, y, ImageChannel.GREEN, Math.max(0, Math.min(factor * (this.get(x, y, ImageChannel.GREEN) - 128) + 128, 255)));
                newImage.set(x, y, ImageChannel.BLUE, Math.max(0, Math.min(factor * (this.get(x, y, ImageChannel.BLUE) - 128) + 128, 255)));
            }
        }
        return newImage;
    }

    adjustSaturation(value: number): ImageInterface {
        const newImage = new RGBImage(this._width, this._height, this._pixels);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                let r = this.get(x, y, ImageChannel.RED) / 255;
                let g = this.get(x, y, ImageChannel.GREEN) / 255;
                let b = this.get(x, y, ImageChannel.BLUE) / 255;
                // Convert RGB to HSL
                let max = Math.max(r, g, b);
                let min = Math.min(r, g, b);
                let l = (max + min) / 2;
                let s = 0;
                let h = 0;
                if (max !== min) {
                    let d = max - min;
                    s = d / (1 - Math.abs(2 * l - 1));
                    if (max === r) {
                        h = ((g - b) / d) % 6;
                    } else if (max === g) {
                        h = (b - r) / d + 2;
                    } else {
                        h = (r - g) / d + 4;
                    }

                    h *= 60;
                    if (h < 0) h += 360;
                }
                // Adjust saturation
                s = Math.max(0, Math.min(s * (1 + value / 100), 1));
                // Convert HSL back to RGB
                let c = (1 - Math.abs(2 * l - 1)) * s;
                let x1 = c * (1 - Math.abs((h / 60) % 2 - 1));
                let m = l - c / 2;
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
                newImage.set(x, y, ImageChannel.RED, Math.max(0, Math.min((r1 + m) * 255, 255)));
                newImage.set(x, y, ImageChannel.GREEN, Math.max(0, Math.min((g1 + m) * 255, 255)));
                newImage.set(x, y, ImageChannel.BLUE, Math.max(0, Math.min((b1 + m) * 255, 255)));
            }
        }
        return newImage;
    }

    verticalFlip(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                newImage.set(x, y, ImageChannel.RED, this.get(x, this._height - 1 - y, ImageChannel.RED));
                newImage.set(x, y, ImageChannel.GREEN, this.get(x, this._height - 1 - y, ImageChannel.GREEN));
                newImage.set(x, y, ImageChannel.BLUE, this.get(x, this._height - 1 - y, ImageChannel.BLUE));
            }
        }
        return newImage;
    }

    horizontalFlip(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                newImage.set(x, y, ImageChannel.RED, this.get(this._width - 1 - x, y, ImageChannel.RED));
                newImage.set(x, y, ImageChannel.GREEN, this.get(this._width - 1 - x, y, ImageChannel.GREEN));
                newImage.set(x, y, ImageChannel.BLUE, this.get(this._width - 1 - x, y, ImageChannel.BLUE));
            }
        }
        return newImage;
    }

    greyscaleIntensity(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                const avg = Math.round((this.get(x, y, ImageChannel.RED) + this.get(x, y, ImageChannel.GREEN) + this.get(x, y, ImageChannel.BLUE)) / 3);
                newImage.set(x, y, ImageChannel.RED, avg);
                newImage.set(x, y, ImageChannel.GREEN, avg);
                newImage.set(x, y, ImageChannel.BLUE, avg);
            }
        }
        return newImage;
    }

    greyscaleLuma(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                const luma = Math.round(0.2126 * this.get(x, y, ImageChannel.RED) + 0.7152 * this.get(x, y, ImageChannel.GREEN) + 0.0722 * this.get(x, y, ImageChannel.BLUE));
                newImage.set(x, y, ImageChannel.RED, luma);
                newImage.set(x, y, ImageChannel.GREEN, luma);
                newImage.set(x, y, ImageChannel.BLUE, luma);
            }
        }
        return newImage;
    }

    greyscaleValue(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                const value = Math.max(this.get(x, y, ImageChannel.RED), this.get(x, y, ImageChannel.GREEN), this.get(x, y, ImageChannel.BLUE));
                newImage.set(x, y, ImageChannel.RED, value);
                newImage.set(x, y, ImageChannel.GREEN, value);
                newImage.set(x, y, ImageChannel.BLUE, value);
            }
        }
        return newImage;
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
        // Floyd-Steinberg dithering for greyscale
        const newImage = new RGBImage(this._width, this._height);

        // Create a deep copy of the pixel data to work on
        const pixels: number[][][] = [];
        for (let y = 0; y < this._height; y++) {
            const row: number[][] = [];
            for (let x = 0; x < this._width; x++) {
                // Convert to greyscale using luminosity method
                const r = this.get(x, y, ImageChannel.RED);
                const g = this.get(x, y, ImageChannel.GREEN);
                const b = this.get(x, y, ImageChannel.BLUE);
                const grey = 0.299 * r + 0.587 * g + 0.114 * b;
                row.push([grey, grey, grey]);
            }
            pixels.push(row);
        }

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const oldPixel = pixels[y][x][0];
                const newPixel = oldPixel < 128 ? 0 : 255;
                const error = oldPixel - newPixel;

                // Set the dithered value to all channels
                newImage.set(x, y, ImageChannel.RED, newPixel);
                newImage.set(x, y, ImageChannel.GREEN, newPixel);
                newImage.set(x, y, ImageChannel.BLUE, newPixel);

                // Distribute the error to neighboring pixels
                // Floyd-Steinberg weights:
                //     *    7
                // 3   5   1
                if (x + 1 < this._width) {
                    pixels[y][x + 1][0] += error * 7 / 16;
                    pixels[y][x + 1][1] += error * 7 / 16;
                    pixels[y][x + 1][2] += error * 7 / 16;
                }
                if (y + 1 < this._height) {
                    if (x > 0) {
                        pixels[y + 1][x - 1][0] += error * 3 / 16;
                        pixels[y + 1][x - 1][1] += error * 3 / 16;
                        pixels[y + 1][x - 1][2] += error * 3 / 16;
                    }
                    pixels[y + 1][x][0] += error * 5 / 16;
                    pixels[y + 1][x][1] += error * 5 / 16;
                    pixels[y + 1][x][2] += error * 5 / 16;
                    if (x + 1 < this._width) {
                        pixels[y + 1][x + 1][0] += error / 16;
                        pixels[y + 1][x + 1][1] += error / 16;
                        pixels[y + 1][x + 1][2] += error / 16;
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
                    // Clamp values between 0 and 255
                    sum = Math.max(0, Math.min(255, Math.round(sum)));
                    newImage.set(x, y, channel, sum);
                }
            }
        }
        return newImage;
    }

    sepia(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const r = this.get(x, y, ImageChannel.RED);
                const g = this.get(x, y, ImageChannel.GREEN);
                const b = this.get(x, y, ImageChannel.BLUE);
                
                // Apply sepia filter formula
                const newR = Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189)));
                const newG = Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168)));
                const newB = Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)));
                
                newImage.set(x, y, ImageChannel.RED, newR);
                newImage.set(x, y, ImageChannel.GREEN, newG);
                newImage.set(x, y, ImageChannel.BLUE, newB);
            }
        }
        return newImage;
    }
    
    invert(): ImageInterface {
        const newImage = new RGBImage(this._width, this._height);
        
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                for (let channel = 0; channel < 3; channel++) {
                    const value = this.get(x, y, channel);
                    newImage.set(x, y, channel, 255 - value);
                }
            }
        }
        return newImage;
    }

}
