const db = require('../../db');


const createLike = async (userId, treeId) => {

    const tree = await db.tree.findUnique({ where: { id: treeId }, rejectOnNotFound: false });
    if (tree === null) {
        return {
            status: 404,
            data: { message: 'Tree not found' }
        }

    }
    const treeLike = await db.treeLike.findUnique({ where: { id: `${treeId}-${userId}` }, rejectOnNotFound: false });
    if (treeLike !== null) {
        return {
            status: 409,
            data: { message: 'Already liked the tree' }
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
        data: `Liked the tree ${tree.name}`
    }
}

const deleteLike = async (userId, treeId) => {
    const treeLike = await db.treeLike.findUnique({ where: { id: `${treeId}-${userId}` }, rejectOnNotFound: false });
    if (treeLike === null) {
        return {
            status: 404,
            data: { message: 'Like not found' }
        }

    }


    await db.treeLike.delete({
        where: {
            id: `${treeId}-${userId}`
        }
    })
    return {
        status: 204,
        data: { message: `Unliked the tree` }
    }
}

const getLike = async (userId, treeId) => {
    const treeLike = await db.treeLike.findUnique({ where: { id: `${treeId}-${userId}` }, rejectOnNotFound: false });
    if (treeLike === null) {
        return {
            status: 404,
            data: { message: 'Like not found' }
        }

    }

    return {
        status: 200,
        data: { message: `Liked the tree` }
    }
}


module.exports = {
    createLike, deleteLike, getLike
}