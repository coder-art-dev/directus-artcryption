import { defineHook } from '@directus/extensions-sdk';
import crypto from 'node:crypto';
import {sign} from 'jsonwebtoken';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
export default defineHook(({ filter, action }, {services, env}) => {
    const {UsersService} = services;

    filter('users.create', async (input, {collection}, {database, schema, accountability}) => {
        if (!accountability) {
            return;
        }
        return input;
        /*
        if (!accountability || (accountability.admin && accountability.app)) {
            return;
        } else {
            if (input.status) {
                delete input.status;
            }
            if (input.role) {
                delete input.role;
            }
            return input;
        }
        */
    })

	action('users.create', async ({ payload }, { database, schema, accountability }) => {
        console.log("Created user");

        if (!accountability)
            return;

        const mailerSend = new MailerSend({
            apiKey: process.env.MAIL_API_KEY || '',
          });
        const sentFrom = new Sender("MS_cXutqm@trial-v69oxl5o2kkg785k.mlsender.net", "Artcryption");
        const { email } = payload;
        const email_hash = "crypto.hash('sha256', email)"; // TODO : hash email here
        const user = await database.select('id', 'status').from('directus_users').where('email', email ).first();
        const usersService = new UsersService({ schema: schema });
        await usersService.updateOne(user.id, { email_verified: false });
        await usersService.updateOne(user.id, { email_hash: email_hash });
        const recipients = [
            new Recipient(email, "Artcryption User")
          ];

        const tokenPayload = { email, scope: 'invite' };

        const token = sign(tokenPayload, env.SECRET, {
            expiresIn: '7d',
            issuer: 'directus'
        });

        const inviteURL = env.FRONTEND_URL + '/auth/activate?token=' + token;
        console.log("sending email");
        console.log(inviteURL);
        const emailParams = new EmailParams().setFrom(sentFrom).setTo(recipients).setSubject("Verify Your email").setText("Follow link to verify your email " + inviteURL);

        await mailerSend.email.send(emailParams);
        console.log("sent email");
	});
});
