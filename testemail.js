const mailjet = require('node-mailjet')
    .connect('8d3143c0c634e0b63a47e799dab3f227', '8adfde7abcac0bab7e40fa4f4878546b')


const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
        "Messages": [
            {
                "From": {
                    "Email": "karan.e0119039@sret.edu.in",
                    "Name": "Karan"
                },
                "To": [
                    {
                        "Email": "karanvknarayanan@gmail.com",
                        "Name": "Karan"
                    }
                ],
                "Subject": "Greetings from Karan.",
                "TextPart": "My first Mailjet email",
                "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                "CustomID": "AppGettingStartedTest"
            }
        ]
    })
request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
