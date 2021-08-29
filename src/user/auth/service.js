const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const db = require("../../db");
const { redis } = require("../../redis");
const { restGenerator, verifyGenerator } = require("../../utils/templates");
const { sendEmail } = require("./email")

const sendVerificationEmail = async ({ email, name }) => {
    const code = Math.floor(Math.random() * 1000000)
    const setcode = await redis.set(`verify:${email}`, code, 'EX', 60 * 30)
    if (setcode != 'OK') {
        return {
            data: {
                error: "something went wrong"
            },
            status: 500
        }
    }
    const content = await verifyGenerator(code, name)
    const sent = await sendEmail({ email: email, content, name: name, subject: "Verify Email", type: "verifyEmail" })
    return sent
}

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
    }).catch(console.log)
    const sent = await sendVerificationEmail({ email: user.email, name: user.name })
    sent.status = 201
    return sent
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


const gerneateToken = async (user, role, time = "24h") => {
    const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
        expiresIn: time
    })
    return token
}

const sendResetPasswordEmail = async ({ email }) => {
    const user = await db.user.findUnique({ where: { email: email }, rejectOnNotFound: false })
    if (user === null) {
        return {
            data: {
                error: "email does not exist"
            },
            status: 404
        }
    }
    const code = Math.floor(Math.random() * 1000000)
    const setcode = await redis.set(`reset:${user.id}`, code, 'EX', 60 * 30)
    if (setcode != 'OK') {
        return {
            data: {
                error: "something went wrong"
            },
            status: 500
        }
    }
    const content = await restGenerator(code, user.name)
    const sent = await sendEmail({ email: user.email, content, name: user.name, subject: "Reset Password", type: "resetPassword" })
    return sent
}

const verifyResetPassword = async ({ email, code }) => {
    const user = await db.user.findUnique({ where: { email: email }, rejectOnNotFound: false })
    if (user === null) {
        return {
            data: {
                error: "email does not exist"
            },
            status: 404
        }
    }
    const getcode = await redis.get(`reset:${user.id}`)
    if (getcode != code) {
        return {
            data: {
                error: "code does not match"
            },
            status: 401
        }
    }
    delete user["password"]
    const token = await gerneateToken(user.id, "reset", "30m")
    return {
        data: {
            token
        },
        status: 200
    }
}

const changePassword = async ({ id, password, type }) => {
    const user = await db.user.findUnique({ where: { id: id }, rejectOnNotFound: false })
    if (user === null) {
        return {
            data: {
                error: "user does not exist"
            },
            status: 404
        }
    }
    if (type === "reset") {
        const resetPassword = await bcrypt.hash(password, 10)
        user = await db.user.update({ where: { id: id }, data: { password: resetPassword } })
    } else {
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return {
                data: {
                    error: "password does not match"
                },
                status: 401
            }
        } else {
            const newPassword = await bcrypt.hash(password, 10)
            user = await db.user.update({ where: { id: id }, data: { password: newPassword } })
        }

    }
}

module.exports = {
    createUser,
    loginUser,
    sendResetPasswordEmail,
    verifyResetPassword,
    changePassword

}