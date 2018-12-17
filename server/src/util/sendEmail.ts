import * as nodemailer from "nodemailer";

/**
 * Uses nodemailer to send an email ot
 * @param data 
 */
export default function sendEmail(data: any) {

	// Throw an error if 

	let transporter = nodemailer.createTransport({
		host: process.env["EMAIL_HOST"],
		port: process.env["EMAIL_PORT"],
		secure: true,
		auth: {
			user: process.env["EMAIL_USERNAME"],
			pass: process.env["EMAIL_PASSWORD"],
		}
	});

	let mailOptions = {
		from: data.from, // sender address
		to: process.env["EMAIL_RECIPIENT_OVERRIDE"] ? [process.env["EMAIL_RECIPIENT_OVERRIDE"]] : data.to, // list of receivers
		subject: data.subject, // Subject line
		text: data.text, // plain text body
		html: data.html // html body
	};

	// Return promise for sending the email
	return transporter.sendMail(mailOptions);
}
