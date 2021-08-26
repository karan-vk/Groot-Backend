const db = require('../db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const createUser = async ({ email, name, password }) => {
    password = await bcrypt.hash(password, 10)

    const already = await db.user.count({ where: { email: email } })
    if (already > 0) {
        return {
            data: {
                error: "email already exist"
            },
            status: 400
        }
    }
    const user = await db.user.create({
        data: {
            email,
            name,
            password
        },
        select: {
            email: true,
            name: true,
            id: true
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


module.exports = {
    createUser, loginUser,
    updateUser, deleteUser,
    getUser
}