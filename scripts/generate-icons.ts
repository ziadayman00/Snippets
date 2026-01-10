
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SOURCE_IMAGE = path.join(PUBLIC_DIR, 'favicon.png'); // Using PNG as source for reliable resize

async function generateIcons() {
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error("Source image not found:", SOURCE_IMAGE);
        return;
    }

    console.log("Generating icons from", SOURCE_IMAGE);

    // 1. favicon.ico (32x32)
    await sharp(SOURCE_IMAGE)
        .resize(32, 32)
        .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
    console.log("Created favicon.ico");

    // 2. apple-touch-icon.png (180x180)
    await sharp(SOURCE_IMAGE)
        .resize(180, 180)
        .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log("Created apple-touch-icon.png");

    // 3. icon-192.png (192x192) - Android
    await sharp(SOURCE_IMAGE)
        .resize(192, 192)
        .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));
    console.log("Created icon-192.png");

    // 4. icon-512.png (512x512) - Android
    await sharp(SOURCE_IMAGE)
        .resize(512, 512)
        .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
    console.log("Created icon-512.png");
}

generateIcons().catch(console.error);
