const config = require('./mailConfig.json');

module.exports = class Mailer {
    constructor(){
        this.transporter = require('nodemailer').createTransport(config.transport);
    };

    // VVV For front VVV
    //FrontAddress = 'http://localhost:3000';
    // VVV For postman VVV
    FrontAddress = 'http://localhost:3000';

    sendConfirmEmail (email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent Email confirmation',
            html: `You can confirm your email by this URL: \
            <a href="${this.FrontAddress}/confirmEmail/${token}">\
            Confirm Email!</a>`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendRefund (email, order_id) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent Ticket refund',
            html: `You purchased a ticket at our site Uevent: \
            <a href="${this.FrontAddress}"> Uevent</a>\
            \nWe are terribly sorry to inform you that something went wrong!\
            You will get your refund in the nearest future.
            Your order id: ${order_id}
            You can contact us at: deds_dev_xye.coc.interactive@ukr.net`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendRefundError (email, order_id) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent Ticket refund ERROR',
            html: `You purchased a ticket at our site Uevent: \
            <a href="${this.FrontAddress}"> Uevent</a>\
            \nWe were trying to refund your money but something went wrong!
            \nYour order id: ${order_id}
            \nPlease contact us at deds_dev_xye.coc.interactive@ukr.net so we can solve the problem as soon as possible!`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendTicket (email, data) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent: Your tickets!',
            html: `Dear ${data.buyer}, You successfuly purchased tickets for an event that will take place\
            at ${data.location} at ${data.event_datetime}!\
            \nGood luck`,
            attachments: [{
                filename: data.buyer + '_ticket.pdf',
                content: data.buffer
            }]
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendResetUserPassword (email, password) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent Password reset',
            html: `Here is your new password \
            <strong> ${this.password}</strong>
           Change it as soon as posible`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };
}