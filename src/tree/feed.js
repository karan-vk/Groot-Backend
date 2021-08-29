const db = require('../db');

const feed = async (name = "TEST TREE", limit, userId = null) => {
    if (!limit) {
        limit = 10;
    }
    let allow = true
    if (userId) {
        allow = {
            where: {
                userId: userId
            }
        }
    }
    const trees = await db.tree.findMany({

        cursor: {
            name: name
        },
        take: limit,
        select: {
            id: true,
            name: true,
            conditions: true,
            image: true,
            location: true,
            thumb: true,
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
                                gte: 3
                            }
                        }
                    }
                },
                orderBy: {
                    VolunteeringVerification: {
                        _count: "desc"
                    }
                },
                take: 5,
                select: {
                    comment: true,
                    completedAt: true,
                    status: true,
                    by: {
                        select: {
                            id: true,
                            name: true,
                            profilePicThumb: true,
                        }
                    }
                }
            },
            userId: true,
            TreeLike: allow
        },



    });
    trees.map(async tree => {
        const treeId = tree.id;
        tree.TotalFund = await db.fund.aggregate({
            where: {
                AND: [
                    {
                        treeId: treeId
                    }, {
                        status: "paid"
                    }
                ]

            },
            _sum: {
                amount: true
            }
        })
    })
    if (trees.length === 0) {
        return {
            data: {
                message: "No trees found"
            },
            status: 204
        }
    }

    return {
        data: trees,
        status: 200
    };


}

module.exports = feed