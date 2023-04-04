# Nextjs blog

> This is blog is built using Nextjs and Firebase and hosted on Vercel.

You can clone this repository and You need to setup your own configuration for firebase account.
replace those api keys in firebaseInit.js with your firebase app

## Features

- Two types of users are there Authors and Admin
- Authors are public users who can create their account and write theire blog post.
- Admin can access all the blog post and have right to modify the them.
- blog post are saved in Firebase and are fetched using SSR technique of Next.js (getServerSideProps)
- For Authentication and global states I have used Context API.
- Protected routes are created using HOC functions.

## 🪲 bug
> This is a minimum feature application not focused on design as I have used plain CSS and It's not responsive
