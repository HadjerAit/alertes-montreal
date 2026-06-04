import sharp from 'sharp'

const sizes = [192, 512, 180]

for (const size of sizes) {
  await sharp('assets/logo.jpeg')
    .resize(size, size)
    .toFile(`public/icons/icon-${size}.png`)
  console.log(`icon-${size}.png créé !`)
}