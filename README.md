# Sam's Closet (in Next.js!)

Vercel link: https://a4-notsoli-deploy.vercel.app/

To log in (to test edit and remove functions), use 'username' and 'password'

This was a weird experience--I had to pretty rapidly shift how I store and retrieve images. I did this the hacky way; images are simply stored by base64-encoding them and storing them directly in the database. Since MongoDB's document limit is around 16MB, the vast majority of images fit fine.

Other than that, Next.js makes the development experience really clean.