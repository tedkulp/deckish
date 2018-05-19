const sharp = require('sharp');
const path = require('path');
const PImage = require('pureimage');
const streamBuffers = require('stream-buffers');
const Promise = require('bluebird');
const font = PImage.registerFont(path.join(__static, '/fonts/SourceSansPro-Regular.ttf'), 'Source Sans Pro');

const measureText = (font, ctx, text) => {
    if(!font) console.log("WARNING. Can't find font family ", ctx._font.family);
    var fsize   = ctx._font.size;
    var glyphs  = font.font.stringToGlyphs(text);
    var advance = 0;
    glyphs.forEach(function(g) { advance += g.advanceWidth; });

    return {
        width: advance/font.font.unitsPerEm*fsize,
        emHeightAscent: font.font.ascender/font.font.unitsPerEm*fsize,
        emHeightDescent: font.font.descender/font.font.unitsPerEm*fsize,
    };
};

const generatePImage = async (font, textString) => {
    const img = PImage.make(72, 72);
    const ctx = img.getContext('2d');
    ctx.clearRect(0, 0, 72, 72);
    ctx.font = '15pt "Source Sans Pro"';
    ctx.USE_FONT_GLYPH_CACHING = false;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff';
    const textWidth = measureText(font, ctx, textString);
    ctx.strokeText(textString, 72/2-textWidth.width/2, 72-6);
    ctx.fillText(textString, 72/2-textWidth.width/2, 72-6);

    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: 20736, // Start at what should be the exact size we need
        incrementAmount: 1024 // Grow by 1 kilobyte each time buffer overflows.
    });

    await PImage.encodePNGToStream(img, writableStreamBuffer);

    return writableStreamBuffer.getContents();
};

const generateBaseImage = backgroundColor => {
    return sharp({
        create: {
            width: 72,
            height: 72,
            channels: 3,
            background: backgroundColor || '#000',
        }
    })
    .png();
};

const generateTextImageBuffer = async () => {
    return sharp(new Buffer(draw.svg()))
        .toBuffer();
};

const generateImageOverlayBuffer = async imageName => {
    return sharp(imageName)
        .resize(54)
        .toBuffer();
};

const overlayBuffer = async (baseImage, overlayBuffer, options) => {
    return sharp(await baseImage.toBuffer())
        .overlayWith(overlayBuffer, options);
};

const overlayImage = async (baseImage, overlayImage) => {
    return sharp(await baseImage)
        .overlayWith(sharp(overlayImage));
};

exports.generateImage = props => {
    return new Promise((resolve, reject) => {
        font.load(async () => {
            try {
                let baseImage = generateBaseImage(props.color);
                baseImage = await overlayBuffer(baseImage, await generateImageOverlayBuffer(path.join(__static, props.backgroundImage)), {left: 72/2 - 54/2, top: 0});
                baseImage = await overlayBuffer(baseImage, await generatePImage(font, props.text));
                baseImage = await baseImage.png().toBuffer();
                const final = await sharp(baseImage).flatten().raw().toBuffer();
                resolve(final);
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });
    });
};