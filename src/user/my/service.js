const db = require('../../db');


const myTrees = async (userId) => {
    const myTrees = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            Tree: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    thumb: true,
                    type: true,
                    location: true,
                    TreeScoring: {
                        select: {
                            id: true,
                            by: {
                                select: {
                                    id: true,
                                    name: true,
                                    profilePicThumb: true
                                }
                            },
                            treeId: true,
                            score: true,
                        }
                    },
                    Fund: {
                        where: {
                            status: "paid"
                        },
                        select: {
                            by: {
                                select: {
                                    id: true,
                                    name: true,
                                    profilePicThumb: true
                                }
                            },
                            amount: true,

                        }
                    },
                    conditions: true,
                    userId: true,

                }
            }
        }
    })
    return {
        data: myTrees.Tree,
        status: 200
    };
}

const myFunds = async (userId) => {
    const myFunds = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            Fund: {
                where: {
                    status: "paid"
                },
                select: {
                    by: {
                        select: {
                            id: true,
                            name: true,
                            profilePicThumb: true
                        }
                    },
                    amount: true,

                }
            }
        }
    })
    return {
        data: myFunds.Fund,
        status: 200
    };
}

const myPayments = async (userId) => {
    const myPayments = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            Payment: {

                select: {

                    amount: true,
                    status: true,
                    currency: true,
                    amount_paid: true,
                    notes: true,
                    receipt: true,
                    id: true,
                    created_at: true,
                    updated_at: true,
                    attemps: true,


                }
            }
        }
    })
    return {
        data: myPayments.Payment,
        status: 200
    };
}

module.exports = { myTrees, myFunds, myPayments };