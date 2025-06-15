import ImageInterface from "./ImageInterface";

export default interface ImageManager {
    /**
     * Creates a new image with the specified width, height, and name.
     *
     * @param width - The width of the new image (must be non-negative).
     * @param height - The height of the new image (must be non-negative).
     * @param name - The name of the new image (must not be null or empty).
     * @throws Error if the dimensions are invalid or the name is not provided.
     */
    createImage(width: number, height: number, name: string): void;

    /**
     * Loads an existing image into the manager with the specified name.
     *
     * @param image - The `RGBImage` to be loaded.
     * @param name - The name to associate with the loaded image (must not be null or empty).
     * @throws Error if the image or name is not provided.
     */
    loadImage(image: ImageInterface, name: string): void;

    /**
     * Removes an image with the specified name from the manager.
     *
     * @param name - The name of the image to be removed (must not be null or empty).
     * @throws Error if the name is not provided.
     */
    removeImage(name: string): void;

    /**
     * Retrieves an image by its name.
     *
     * @param name - The name of the image to retrieve (must not be null or empty).
     * @returns The image associated with the specified name, or `null` if not found.
     * @throws Error if the name is not provided.
     */
    getImage(name: string): ImageInterface | null;

    /**
     * Generates a histogram for an image with the specified name.
     *
     * @param name - The name of the image to generate histogram for (must not be null or empty).
     * @returns A 2D array containing histograms for R, G, B channels, where each channel's histogram
     *          is an array of 256 elements representing the frequency of each pixel value.
     * @throws Error if the name is not provided or the image is not found.
     */
    getImageHistogramData(name: string): number[][];
}