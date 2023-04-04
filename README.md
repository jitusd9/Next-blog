# Nextjs blog

> This is blog is built using Nextjs and Firebase.

You can clone this repository and You need to setup your own configuration for firebase account.
and replace those api keys in firebaseInit.js with your firebase app.

Site is Live at [Hosted on Vercel](https://link-url-here.org)

## 🚀 Features

- Two types of users are there Authors and Admin
- Authors are public users who can create their account and write their blog post.
- Admin can access all the blog post and have right to modify the them.

## ⚙️ Tech

- Firebase is used to store data and SSR and CSR bothe are used to access it.
- For Authentication and global states I have used Context API.
- Protected routes are created using HOC functions.
  
## 📈 Room for Improvement
> Certainly there a lot can be done with authentication and Code opetimization for production application

- For Authentication I have used just strings but tokens and cookies are better option.
- In many places I wrote entire code on which could have been converted into components or hooks.
- I did not care for responsiveness here just used vanilla CSS (I like it)


## 🪲 bug
> you might find some buts during pagination and some features might be missing as my focus was to build a minimum blog site
