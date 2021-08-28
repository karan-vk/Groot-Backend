const db = require('../db')

const s3 = require('../aws/s3');
const { generateUserPic, generateThumb } = require('../utils');

const updateUser = async (userId, { name }) => {

    const user = await db.user.update({
        where: {
            id: userId
        },
        data: {
            name,
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    })

    return {
        data: user,
        status: 200
    }
}
const deleteUser = async (userId) => {
    await db.user.delete({
        where: {
            id: userId
        }
    })
    return {
        data: {
            userId,
            message: "User deleted"
        },
        status: 202
    }
}

const getUser = async (userId) => {
    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            Tree: true,
            Volunteering: true,
        }

    })
    delete user["password"]
    return {
        data: user,
        status: 200
    }
}

const setUserPic = async (userId, pic) => {

    const BUCKET_NAME = process.env.BUCKET_NAME
    pic = await generateUserPic(pic)
    const thumb = await generateThumb(pic)
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `${userId}/Profile.png`,
        Body: pic,
        ACL: 'public-read'
    };
    const result = await s3
        .upload(uploadParams)
        .promise()
        .catch((e) => console.log(e));
    const uploadParamsThumb = {
        Bucket: BUCKET_NAME,
        Key: `${userId}/ProfileThumb.png`,
        Body: thumb,
        ACL: 'public-read'
    }
    const resultThumb = await s3
        .upload(uploadParamsThumb)
        .promise()
        .catch((e) => console.log(e));
    const picurl = `/image/user/${userId}`
    const user = await db.user.update({
        where: {
            id: userId
        },
        data: {
            profilePic: picurl,
            profilePicThumb: picurl + "/thumb",
        },
        select: {
            profilePic: true,
            profilePicThumb: true
        }
    })
    return {
        data: user,
        status: 200
    }

}


module.exports = {

    updateUser,
    deleteUser,
    getUser,
    setUserPic
}