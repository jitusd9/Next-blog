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
import { onSnapshot, query, collection, where, limit, getDocs, startAfter, startAt, getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseInit";
import formatDistanceToNow from "date-fns/formatDistanceToNow";


function Index() {

  const {currentUser} = useAuth()
  const [open ,setOpen] = useState(false)
  
  const [postList, setPostList] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [content, setContent] = useState(null);
  const [excerpt, setExcerpt] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [prevItem, setPrevItem] = useState(null);
  const [disableNext, setDisableNext] = useState(false);

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

  const loadMore = async (e) => {
    setLoading(true)
    let q
    let lastSnap = null
    let prevFirstItem = postList[0].id
    setPrevItem(prevFirstItem)
    if(lastVisible || prevFirstItem){

      
      if(e.target.name === 'prev'){
        console.log(e.target.name, prevFirstItem, prevItem, lastVisible)
        const docSnap = await getDoc(doc(collection(db, "posts"), prevItem));
        lastSnap = startAt(docSnap)
      }else if(e.target.name === 'next'){
        console.log(e.target.name, lastVisible, prevItem)
        const docSnap = await getDoc(doc(collection(db, "posts"), lastVisible));
        lastSnap = startAfter(docSnap)
      }
      
    }
    
    if(currentUser.email === 'admin@example.com'){
       q = query(collection(db, "posts"), 
       lastSnap,
       limit(3))
    }else{
       q = query(collection(db, "posts"), where("author", "==", currentUser.email),
       lastSnap,
       limit(3));
    }
    const querySnapshot = await getDocs(q);

    let posts = []

    querySnapshot.forEach(doc => {
      let data = doc.data()
      data.id = doc.id
      data.createdAt = formatDistanceToNow(doc.data().createdAt.toDate(), { addSuffix: true })
      posts.push(data);
    })



    if(posts.length < 3){
      setDisableNext(true)
    }else{
      setDisableNext(false)
    }

    if(querySnapshot.empty){
      setLoading(false)
      setDisableNext(true)
      return
    }

    setLastVisible(posts[posts.length - 1]?.id)
    setPostList(posts)
    setLoading(false)

  }

  let editorProps = {
    content,
    setTitle,
    setAuthor,
    setContent,
    setExcerpt,
    handlePublish,
  }

  useEffect(() => {
    
    if(currentUser){
      setLoading(true)
      let q
      if(currentUser.email === 'admin@example.com'){
         q = query(collection(db, "posts"), limit(3))
      }else{
         q = query(collection(db, "posts"), where("author", "==", currentUser.email), limit(3));
      }
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let posts = [];
 
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          data.id = doc.id
          data.createdAt = formatDistanceToNow(doc.data().createdAt.toDate(), { addSuffix: true })
          posts.push(data);
        });
        setLastVisible(posts[posts.length - 1]?.id)
        setPostList(posts)
        setLoading(false)
      });

      return () => {
        unsubscribe()
      }

    }

  }, [currentUser])
  
  if(loading){
    return <LoaderComponent />
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
        !open ? postList.map((post) => (
            <BlogCard key={post.id} post={post} from="dashboard" />
        )) : null
      }

      {
        !open ? <div className={styles.pagination}>

        {
          false ? <p className={styles.disabled}>prev</p> : <button name="prev" onClick={loadMore}>prev</button>
        }

        {
          disableNext ? <p className={styles.disabled}>next</p> : <button name="next" onClick={loadMore}>next</button>
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

