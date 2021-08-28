const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)
const sendEmail = async ({ email, subject, type, name, content }) => {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "karan.e0119039@sret.edu.in",
                        "Name": "Support"
                    },
                    "To": [
                        {
                            "Email": `${email}`,
                            "Name": `${name}`
                        }
                    ],
                    "Subject": `${subject}`,
                    "HTMLPart": `${content}`,
                    "CustomID": `${type}`
                }
            ]
        })
    request
        .then((result) => {
            if (result.body.Messages[0].Status == 'success') {
                return {
                    status: 200,
                    data: { message: "Email sent successfully" }
                }
            }
            else {
                return {
                    status: 400,
                    data: { message: "Email not sent" }
                }
            }
        })
        .catch(() => {
            return {
                status: 500,
                data: { message: "Email sending failed" }
            }
        })
}

module.exports = {
    sendEmail
}
