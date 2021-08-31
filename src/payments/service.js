const db = require('../db')
const Razorpay = require("razorpay")
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

const payment = async (amount) => {
    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: `${Math.floor(Math.random() * 1000000)}`,
        // notes: { userId: userId, funds: funds },

    };
    let orderinfo
    await instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err);
            return {
                status: 500
            }
        }
        orderinfo = order

    });
    return orderinfo

}

const createPayment = async (amount, userId) => {
    // const amount = await db.fund.aggregate({
    //     where: {
    //         id: {
    //             in: funds
    //         }
    //     },
    //     _sum: {
    //         amount: true
    //     }
    // })
    // amount._sum.amount
    // let fundsAggregate = ""
    // funds.forEach(element => {
    //     fundsAggregate += element + " "
    // });
    const x = await payment(amount);
    return {
        status: 200,
        data: amount._sum.amount
    }


}

module.exports = {
    createPayment
}