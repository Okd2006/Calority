import sharp from 'sharp';
import { mkdirSync } from 'fs';

const sizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

for (const [folder, size] of Object.entries(sizes)) {
  const dir = `android/app/src/main/res/${folder}`;
  mkdirSync(dir, { recursive: true });
  await sharp('CALORITYLOGO.png').resize(size, size).toFile(`${dir}/ic_launcher.png`);
  await sharp('CALORITYLOGO.png').resize(size, size).toFile(`${dir}/ic_launcher_round.png`);
  await sharp('CALORITYLOGO.png').resize(size, size).toFile(`${dir}/ic_launcher_foreground.png`);
  console.log(`✓ ${folder} (${size}x${size})`);
}
