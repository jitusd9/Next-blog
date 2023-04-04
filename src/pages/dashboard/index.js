import { getPostByAuthor, getAllPostsPerPage } from "@/utils/database";
import Link from "next/link";
import {useState, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import BlogEditor from "@/components/BlogEditor";
import { useAuth } from "@/components/Authentication/AuthContext";
import styles from '@/styles/blogpage.module.css'
import withAuth from "@/utils/withAuth";
import { createPost } from "@/utils/database";
import { auth } from "../../../firebaseInit";
import LoaderComponent from "@/components/Loading";


function Index({ posts, firstVisible, lastVisible }) {

  const {currentUser} = useAuth()
  const [open ,setOpen] = useState(false)
  

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [content, setContent] = useState(null);
  const [excerpt, setExcerpt] = useState(null);

  const [msg, setMsg] = useState(null);
  
  const handlePublish = async () => {
    if(title && content && excerpt){
      setLoading(true)
      const response = await createPost(title, content, excerpt, auth.currentUser.email)
      if(response){
        setContent(null)
        setLoading(false)
        setMsg(<p className={styles.published}>Published</p>)
        setTimeout(() => {
          setMsg(null)
        }, 2000);
      }else{
        // setting error message
        setMsg(<p className={styles.error}>Error in publishing</p>)
        setTimeout(() => {
          setMsg(null)
        }, 2000);
      }
    }
  }

  let editorProps = {
    content,
    setTitle,
    setAuthor,
    setContent,
    setExcerpt,
    handlePublish,
  }


  return (
    <div className={styles.indexPage}>
      <div className={styles.indexNavbar} >
        <h3>Blogs</h3>
        { msg ? msg : null }
        <div className={styles.indexBtns}>
          {
            open ?
            <>
            <button   className={styles.createBtn} onClick={handlePublish}>publish</button>
             <button className={`${styles.createBtn}, ${styles.closeBtn}`} onClick={() => setOpen(false)} >Close Post Editor</button> 
             </>
             : 
             <>
             
             <button onClick={() => setOpen(true)}  className={styles.createBtn} >Create New Post</button>
             </>
          }
        </div>
      </div>
      {
        open && !loading ? <BlogEditor {...editorProps} /> : open && loading ? <LoaderComponent /> : null
      }
      {
        !open ? posts.map((post) => (
            <BlogCard key={post.id} post={post} from="dashboard" />
        )) : null
      }

      {
        !open ? <div className={styles.pagination}>

        {/* {
          firstVisible === undefined ? <p className={styles.disabled}>prev</p> : <Link href={`/?firstVisible=${firstVisible}`}>prev</Link>
        } */}

        {
          posts.length < 3 ? <p className={styles.disabled}>next</p> : <Link href={`/dashboard?userid=${currentUser?.email}?lastVisible=${lastVisible}`}>next</Link>
        }
      </div> : null
      }

    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {


    if(context.req.cookies.loggedIn) {
      let data
      if(context.query.userid === 'admin@example.com') {
        const {prev, firstVisible, lastVisible } = context.query
        data = await getAllPostsPerPage(firstVisible, lastVisible);
      }else{

        data = await getPostByAuthor(context.query.userid);
      }

      return {
        props: { posts : data.posts, firstVisible : data.firstVisible, lastVisible : data.lastVisible},
      };

    }else{
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

}

