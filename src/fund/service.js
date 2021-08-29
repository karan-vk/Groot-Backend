const db = require('../db');

const createFund = async ({ amount, treeId, currency }, userId) => {
    const fund = await db.fund.create({
        data: {
            amount: amount,
            currency: currency,
            status: 'pending',
            by: {
                connect: {
                    id: userId
                }
            },
            tree: {
                connect: {
                    id: treeId
                }
            },

        }
    })
    return {
        status: 200,
        data: fund
    }
}

const updateFund = async ({ id, amount }, userId) => {
    const exists = await db.fund.findUnique({
        where: { id: id }, rejectOnNotFound: false
    })
    if (!exists) {
        return {
            status: 404,
            data: { message: 'Fund not found' }
        }
    }
    if (exists.userId !== userId) {
        return {
            status: 403,
            data: { message: 'You are not allowed to update this fund' }
        }
    }
    const fund = await db.fund.update({
        where: {
            id: id
        },
        data: {
            amount: amount,
            by: {
                connect: {
                    id: userId
                }
            }
        }
    })
    return {
        status: 200,
        data: fund
    }
}

const deleteFund = async ({ id }, userId) => {
    const exists = await db.fund.findUnique({
        where: { id: id }, rejectOnNotFound: false
    })
    if (!exists) {
        return {
            status: 404,
            data: { message: 'Fund not found' }
        }
    }
    if (exists.userId !== userId) {
        return {
            status: 403,
            data: { message: 'You are not allowed to delete this fund' }
        }
    }
    const fund = await db.fund.delete({
        where: {
            id: id
        }
    })
    return {
        status: 200,
        data: fund
    }
}
const getPendingFunds = async (userId) => {
    const funds = await db.fund.findMany({
        where: {
            AND: [
                { status: 'pending' },
                { userId: userId }
            ]
        }
    })
    return {
        status: 200,
        data: funds
    }
}

const getFund = async (id, userId) => {
    const fund = await db.fund.findUnique({
        where: { id: id }, rejectOnNotFound: false
    })
    if (!fund) {
        return {
            status: 404,
            data: { message: 'Fund not found' }
        }
    }
    if (fund.userId !== userId) {
        return {
            status: 403,
            data: { message: 'You are not allowed to get this fund' }
        }
    }
    return {
        status: 200,
        data: fund
    }
}

module.exports = {
    createFund,
    updateFund,
    deleteFund,
    getPendingFunds,
    getFund
}