import * as nodemailer from "nodemailer";

/**
 * Uses nodemailer to send an email
 * @param data data used to send the email (from, to, subject, text, html)
 */
export default function sendEmail(data: any) {

	// Throw an error if these environment variables aren't defined - we need them
	const usedEnvVarables = [
		"EMAIL_HOST", "EMAIL_PORT", "EMAIL_USERNAME", "EMAIL_PASSWORD",
	];

	usedEnvVarables.forEach((varName) => {
		if (typeof process.env[varName] === "undefined" || 0 === process.env[varName].length) {
			throw new Error(`Could not find environment variable: ${varName}`);
		}
	});

	const transporter = nodemailer.createTransport({
		host: process.env["EMAIL_HOST"],
		port: process.env["EMAIL_PORT"],
		secure: true,
		auth: {
			user: process.env["EMAIL_USERNAME"],
			pass: process.env["EMAIL_PASSWORD"],
		},
	});

	let toEmails = data.to;
	// If we have a recipient override set, then send the mails to them instead
	if (process.env["EMAIL_RECIPIENT_OVERRIDE"] && (0 !== process.env["EMAIL_RECIPIENT_OVERRIDE"].length)) {
		toEmails = [process.env["EMAIL_RECIPIENT_OVERRIDE"]];
	}

	const mailOptions = {
		from: data.from, // sender address
		to: toEmails, // list of receivers
		subject: data.subject, // Subject line
		text: data.text, // plain text body
		html: data.html, // html body
	};

	// Return promise for sending the email
	return transporter.sendMail(mailOptions);
}
