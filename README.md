# Artcryption Directus Prototype

Create link to verify email upon user creation and verify the email at auth/activate

To start directus server:

```console
$ mkdir database volumes
$ cd extensions/directus-extension-auth
$ npm run build
$ docker compose up
```

Sign in to localhost:8055 with email 'admin#example.com' and password 'password' and then create a new user
Go to link sent to email to verify. The email_verified field should update.
