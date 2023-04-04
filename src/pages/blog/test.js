import { getPostByAuthor } from "@/utils/database";
import Link from "next/link";
import {useState, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import BlogEditor from "@/components/BlogEditor";
import { useAuth } from "@/components/Authentication/AuthContext";
import styles from '@/styles/blogpage.module.css'

function Index({ posts }) {


  const {currentUser} = useAuth()
  const [open ,setOpen] = useState(false)


  return (
    <div className={styles.indexPage}>
      <div className={styles.indexNavbar} >
        <h3>Blogs</h3>
        <div className={styles.indexBtns}>
          {
            open ? <button className={styles.closeBtn} onClick={() => setOpen(false)} >close editor</button> : <button onClick={() => setOpen(true)}  className={styles.createBtn} >Create New Post</button>
          }
        </div>
      </div>  
      {
        open ? <BlogEditor /> : null
      }
        {
          !open ? posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          )) : null
        }

    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {

  console.log('context', context.query)


    const posts = await getPostByAuthor(context.query.userid);

    return {
      props: { posts },
    };
  

}

