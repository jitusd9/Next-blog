# Nextjs blog

> This is blog is built using Nextjs and Firebase.

## 🚀 How to run

Site is Live at [Hosted on Vercel](https://next-blog-jitusd9.vercel.app/)

Create a account if you want to add post or comment otherwise you can just read other posts or use
Admin checkbox and enter password 123456 for super access.

You can clone this repository and You need to setup your own configuration for firebase account.
and replace those api keys in firebaseInit.js with your firebase app.


## 🚀 Features

- Two types of users are there Authors and Admin.
- Authors are public users who can create their account and write their blog post.
- Admin can access all the blog post and have right to modify the them.

## ⚙️ Tech

- Firebase is used to store data and SSR and CSR both are used to access it.
- For Authentication and global states I have used Context API.
- Protected routes are created using HOC function.
  
## 📈 Room for Improvement
> Certainly there a lot can be done with authentication and Code opetimization for production application

- For Authentication I have used just strings but tokens and cookies are better option.
- In many places I wrote entire code on which could have been converted into components or hooks.
- I did not care for responsiveness here just used vanilla CSS (I like it).


## 🪲 bug
> you might find some bugs during pagination and some features might be missing as my focus was to build a minimum blog site
