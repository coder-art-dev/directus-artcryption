import { defineEndpoint } from '@directus/extensions-sdk';
import { verify } from 'jsonwebtoken';
export default defineEndpoint((router, context) => {
	const {services, database, env} = context;
	const {UsersService} = services;

	router.get('/activate', async (req, res, next) => {
		try {
            const { token } = req.query;
            console.log(token);
            const payload = verify(token?.toString() || '', env.SECRET, {
                issuer: 'directus'
            });
            console.log(payload);
			const {email, status} = payload;
            const user = await database.select('id', 'status').from('directus_users').where('email', email ).first();
            const usersService = new UsersService({ schema: req.schema });
            await usersService.updateOne(user.id, { email_verified: true });
            console.log("Email verified")
            res.send('Email Verified');
        } catch (error) {
            console.log(error.message);
            return next(new Error(error.message))
        }

		});
	}
);
