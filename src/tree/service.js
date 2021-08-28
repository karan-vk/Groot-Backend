const { type } = require('os');
const db = require('../db');

const createTree = async ({ conditions, location, name, type }, userId) => {
    const alreadyExist = await db.tree.count({ where: { name: name } })
    if (alreadyExist > 0) {
        return {
            status: 409,
            data: { message: 'Tree already exist' }
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
        data: tree,
    }
}

const modifyTree = async (id, { name, location, type, conditions }, userId) => {
    const tree = await db.tree.findUnique({ where: { id }, rejectOnNotFound: false })
    if (tree === null) {
        return {
            status: 404,
            data: { message: 'Tree not found' }
        }
    }
    if (tree.userId !== userId) {
        return {
            status: 403,
            data: 'Forbidden'
        }
    }
    if (tree.name !== name) {
        const check = await db.tree.findUnique({ where: { name }, rejectOnNotFound: false })
        if (check !== null) {
            return {
                status: 409,
                data: { message: 'Tree already exist' }
            }
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
        data: { message: 'Success' },
    }
}


const getTree = async (name) => {
    const tree = await db.tree.findUnique({
        rejectOnNotFound: false,
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
    if (tree) {
        return {
            status: 200,
            data: tree,
        }

    } else {
        return {
            status: 404,
            data: { message: 'Tree not found' },
        }
    }
}

const deleteTree = async (id, userId) => {
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