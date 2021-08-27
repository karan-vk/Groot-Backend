const { type } = require('os');
const db = require('../db');

const createTree = async ({ conditions, location, name, type }, userId) => {
    const alreadyExist = await db.tree.count({ where: { name: name } })
    if (alreadyExist > 0) {
        return {
            status: 409,
            message: 'Tree already exist'
        }
    }
    const tree = await db.tree.create({
        data: {
            conditions,
            location,
            name,
            discoverer: {
                connect: {
                    id: userId
                }
            },
            type: type,


        },
        select: {
            id: true,
            name: true,
            type: true,
            discoverer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            image: true,
            location: true,
            conditions: true,

        }
    })
    return {
        status: 201,
        message: tree,
    }
}

const modifyTree = async (id, { name, location, type, conditions }, userId) => {
    const tree = await db.tree.findUnique({ where: { id } })
    if (tree.userId !== userId) {
        return {
            status: 403,
            message: 'Forbidden'
        }
    }
    const alreadyExist = await db.tree.count({ where: { name: name } })
    if (alreadyExist > 0) {
        return {
            status: 409,
            message: 'Tree already exist'
        }
    }
    await db.tree.update({
        where: { id },
        data: {
            name,
            type,
            location,
            conditions,
        }
    })
    return {
        status: 200,
        message: 'Success',
    }
}


const getTree = async (name) => {
    const exists = await db.tree.count({ where: { name } })
    if (exists === 0) {
        return {
            status: 404,
            message: 'Tree not found'
        }
    }


    const tree = await db.tree.findUnique({
        where: { name },
        select: {
            id: true,
            name: true,
            type: true,
            discoverer: {
                select: {
                    id: true,
                    name: true,
                    profilePicThumb: true,
                }
            },
            Volunteering: {
                where: {
                    VolunteeringVerification: {
                        some: {
                            score: {
                                gt: 3
                            }
                        }
                    }
                },
                select: {
                    by: {
                        select: {
                            id: true,
                            name: true,
                            profilePicThumb: true,
                        }
                    }
                }
            },
            conditions: true,
            TreeScoring: {
                select: {
                    by: {
                        select: {
                            id: true,
                            name: true,
                            profilePicThumb: true,
                        }
                    },
                    score: true,
                    comment: true,


                }
            },
            image: true,
            location: true,
            thumb: true,

        }
    })
    return {
        status: 200,
        message: tree,
    }
}

const deleteTree = async (id) => {
    const tree = await db.tree.findUnique({ where: { id }, select: { userId: true } })
    if (tree.userId !== userId) {
        return {
            status: 403,
            message: 'Forbidden'
        }
    }
    await db.tree.delete({ where: { id } })
    return {
        status: 200,
        message: 'Success',
    }
}

module.exports = {
    createTree, modifyTree, getTree, deleteTree
}