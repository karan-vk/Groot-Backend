const Razorpay = require("razorpay")
var instance = new Razorpay({
    key_id: 'rzp_test_dS9SEUGv63RPnk',
    key_secret: 'BLCPMoB09aMKQqRsePePqlt2',
});

const payment = () => {
    var options = {
        amount: 50000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
    });

}
payment();


