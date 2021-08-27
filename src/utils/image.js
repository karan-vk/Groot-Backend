const sharp = require('sharp');

const generateUserPic = async (pic) => {
    let roundedCorners = Buffer.from(
        '<svg><rect x="0" y="0" width="300" height="300" rx="25" ry="25"/></svg>'
    )
    pic = await sharp(pic).resize({
        width: 300,
        height: 300,
        position: 'center',
        fastShrinkOnLoad: true

    }).composite([{
        input: roundedCorners,
        blend: 'dest-in'
    }]).png({ compressionLevel: 8, quality: 70, progressive: true, palette: true }).toBuffer()
    return pic

}

const generateThumb = async (pic) => {

    pic = await sharp(pic).resize({
        height: 100,
        width: 100,
        position: 'center',
        fastShrinkOnLoad: true
    }).png({ compressionLevel: 8, quality: 70, progressive: true }).toBuffer()
    return pic
}

module.exports = {
    generateThumb,
    generateUserPic
}