const db = require('../db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const s3 = require('../aws/s3');
const { generateUserPic, generateThumb } = require('../utils');
const createUser = async ({ email, name, password }) => {
    password = await bcrypt.hash(password, 10)

    const already = await db.user.count({ where: { email: email } })
    if (already > 0) {
        return {
            data: {
                error: "email already exist"
            },
            status: 409
        }
    }
    const profilePic = `https://avatars.dicebear.com/api/initials/${name.replace(" ", "%20")}.svg?radius=10`
    console.log(profilePic)
    const user = await db.user.create({
        data: {
            email,
            name,
            password,
            profilePic: profilePic,
            profilePicThumb: profilePic + "&height=100",
        },
        select: {
            email: true,
            name: true,
            id: true,
            profilePic: true,
            profilePicThumb: true
        }
    })
    return { data: user, status: 201 }


}

const loginUser = async ({ email, password }) => {
    const already = await db.user.count({ where: { email: email } })
    if (already === 0) {
        return {
            data: {
                error: "email does not exist"
            },
            status: 404
        }
    }
    const user = await db.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            role: true,
            password: true
        }
    })
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
        const token = await gerneateToken(user.id, user.role)
        return {
            data: {
                token
            },
            status: 200
        }

    } else {
        return {
            data: { message: "Something went worong" },
            status: 401
        }
    }
}


const gerneateToken = async (user, role) => {
    const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })
    return token
}

const updateUser = async (userId, { name, email }) => {

    const user = await db.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email,
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
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    setUserPic
}