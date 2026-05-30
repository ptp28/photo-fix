import ImageInterface from "../ImageInterface.ts";
import {ImageOperation, ensureRGBImage} from "./ImageOperation.ts";

export class SaturationOperation implements ImageOperation {
    constructor(private readonly value: number) {}

    apply(image: ImageInterface): ImageInterface {
        const rgbImage = ensureRGBImage(image);
        return rgbImage.map((r, g, b) => {
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
            s = Math.max(0, Math.min(s * (1 + this.value / 100), 1));
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
}
