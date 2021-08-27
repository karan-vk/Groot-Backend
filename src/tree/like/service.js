const db = require('../../db');


const createLike = async (userId, treeId) => {
    let tree;
    try {
        tree = await db.tree.findUnique({ where: { id: treeId } });
    } catch (error) {
        return {
            status: 404,
            message: 'Tree not found'
        }

    }
    await db.treeLike.create({
        data: {
            id: `${treeId}-${userId}`,
            by: {
                connect: {
                    id: userId
                }
            },
            tree: {
                connect: {
                    id: treeId
                }
            }
        }
    })
    return {
        status: 201,
        message: `Liked the tree ${tree.name}`
    }
}

const deleteLike = async (userId, treeId) => {
    try {
        await db.treeLike.findUnique({
            where: {
                id: `${treeId}-${userId}`
            }
        })
    } catch (error) {
        return {
            status: 404,
            message: 'Tree not found'
        }
    }


    await db.treeLike.delete({
        where: {
            id: `${treeId}-${userId}`
        }
    })
    return {
        status: 200,
        message: `Unliked the tree`
    }
}

const getLike = async (userId, treeId) => {
    try {
        await db.treeLike.findUnique({
            where: {
                id: `${treeId}-${userId}`
            }
        })
    } catch (error) {
        return {
            status: 404,
            message: 'Tree not found'
        }
    }

    return {
        status: 200,
        message: `Liked the tree`
    }
}


module.exports = {
    createLike, deleteLike, getLike
}