/**
 * This script detects sprites in an image uploaded by the user.
 * It's used to apply the sprite detection algorithm to a bitmap image.
 * The detected sprites are highlighted with red borders.
 */

const uploadInput = document.getElementById('upload') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

uploadInput.addEventListener('change', () => {
    const file = uploadInput.files?.[0];
    if (!file) return;

    const image = new Image();
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colorMatrix = convertImageDataToColorMatrix(imageData);
        const backgroundColor = detectMostFrequentColor(colorMatrix);
        const boundingBoxes = detectSpriteBoundingBoxes(colorMatrix, backgroundColor);
        drawBoundingBoxes(boundingBoxes);
    };

    image.src = URL.createObjectURL(file);
});

function convertImageDataToColorMatrix(imageData: ImageData): string[][] {
    const { data, width, height } = imageData;
    const matrix: string[][] = [];

    for (let y = 0; y < height; y++) {
        const row: string[] = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];
            row.push(`rgb(${red},${green},${blue})`);
        }
        matrix.push(row);
    }

    return matrix;
}

/**
 * Detects the background color of the image by counting the frequency of each color.
 */
function detectMostFrequentColor(matrix: string[][]): string {
    const counter: Record<string, number> = {};

    for (const row of matrix) {
        for (const color of row) {
            counter[color] = (counter[color] || 0) + 1;
        }
    }

    return Object.entries(counter).reduce((mostFrequent, current) =>
        current[1] > mostFrequent[1] ? current : mostFrequent
    )[0];
}

type PixelPosition = { x: number; y: number };
type BoundingBox = { topLeft: PixelPosition; width: number; height: number };

function detectSpriteBoundingBoxes(matrix: string[][], backgroundColor: string): BoundingBox[] {
    const imageHeight = matrix.length;
    const imageWidth = matrix[0].length;
    const visited: boolean[][] = Array.from({ length: imageHeight }, () => Array(imageWidth).fill(false));

    const boundingBoxes: BoundingBox[] = [];

    const neighborOffsets = [
        [1, 0], // right
        [-1, 0], // left
        [0, 1], // down
        [0, -1], // up
        [1, 1], // bottom-right diagonal
        [-1, -1], // top-left diagonal
        [1, -1], // top-right diagonal
        [-1, 1], // bottom-left diagonal
    ];

    /**
     * Performs a breadth-first search (BFS) to find all connected pixels of the same color.
     */
    function getConnectedPixels(startX: number, startY: number): PixelPosition[] {
        const pixelQueue: PixelPosition[] = [{ x: startX, y: startY }];
        const connectedPixels: PixelPosition[] = [];
        visited[startY][startX] = true;

        while (pixelQueue.length > 0) {
            const { x, y } = pixelQueue.shift()!;
            connectedPixels.push({ x, y });

            for (const [deltaX, deltaY] of neighborOffsets) {
                const neighborX = x + deltaX;
                const neighborY = y + deltaY;

                const isInbounds =
                    neighborX >= 0 && neighborY >= 0 && neighborX < imageWidth && neighborY < imageHeight;

                if (isInbounds && !visited[neighborY][neighborX] && matrix[neighborY][neighborX] !== backgroundColor) {
                    visited[neighborY][neighborX] = true;
                    pixelQueue.push({ x: neighborX, y: neighborY });
                }
            }
        }

        return connectedPixels;
    }

    for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
            if (!visited[y][x] && matrix[y][x] !== backgroundColor) {
                const connectedPixels = getConnectedPixels(x, y);

                const allX = connectedPixels.map((pixel) => pixel.x);
                const allY = connectedPixels.map((pixel) => pixel.y);

                const minX = Math.min(...allX);
                const maxX = Math.max(...allX);
                const minY = Math.min(...allY);
                const maxY = Math.max(...allY);

                boundingBoxes.push({
                    topLeft: { x: minX, y: minY },
                    width: maxX - minX + 1,
                    height: maxY - minY + 1,
                });
            }
        }
    }

    return boundingBoxes;
}

function drawBoundingBoxes(boundingBoxes: BoundingBox[]) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    for (const box of boundingBoxes) {
        ctx.strokeRect(box.topLeft.x, box.topLeft.y, box.width, box.height);
    }
}
