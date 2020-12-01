const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sangraampatwardhan@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}!`
    })
}

const sendDeletionEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sangraampatwardhan@gmail.com',
        subject: 'Account successfully deleted',
        text: `We're sad to see you go, ${name}!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeletionEmail
}