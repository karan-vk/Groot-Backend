require("dotenv").config();
// const Razorpay = require("razorpay")
// var instance = new Razorpay({
//     key_id: 'rzp_test_dS9SEUGv63RPnk',
//     key_secret: 'BLCPMoB09aMKQqRsePePqlt2',
// });

// const payment = () => {
//     var options = {
//         amount: 50000,  // amount in the smallest currency unit
//         currency: "INR",
//         receipt: "order_rcptid_11"
//     };
//     instance.orders.create(options, function (err, order) {
//         console.log(order);
//     });

// }
// payment();

// const user = () => {
//     const db = require("./src/db");
//     db.user.findUnique({ where: { email: "1123@test.com" }, rejectOnNotFound: false }).then(console.log);
// }
// user()

const Redis = require("ioredis");
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redis.set("test1", 123456, "EX", 5).then(console.log).catch(console.log);
console.log("GET");
setTimeout(() => {
    redis.get("test1").then(console.log).catch(console.log);
}, 700);
