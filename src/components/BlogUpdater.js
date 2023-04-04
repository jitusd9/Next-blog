import { useEffect, useState } from "react"
import 'react-quill/dist/quill.snow.css';
import { auth } from "../../firebaseInit";
import styles from "@/styles/editor.module.css"
import LoaderComponent from "./Loading";
import dynamic from "next/dynamic";
import { updatePost } from "@/utils/database";
import { db } from "../../firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const ReactQuill = dynamic(import('react-quill'), { ssr: false })


function BlogUpdater({id}) {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(false)
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  async function handleUpdate() {
    setLoading(true)
    const response = await updatePost(id, title, excerpt, content)
    setMsg(response)
    setLoading(false)
  }

  async function fetchBlog() {
    setLoading(true)
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      setTitle(docSnap.data().title)
      setExcerpt(docSnap.data().excerpt)
      setContent(docSnap.data().content)
      setLoading(false)
    } else {
      console.log("No such document!");
      setMsg("No such document!")
      setLoading(false)
    }

  }

  useEffect(() => {
  fetchBlog()       

  },[id])
  
  return (
    <>
      
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
        <button  style={{backgroundColor: 'black'}} onClick={() => router.back()}>Go back</button>
        <button  style={{backgroundColor: 'green'}} onClick={handleUpdate}>Update Blog</button>
      </div>
      
     {
      loading && !msg ? <LoaderComponent /> : !loading && msg ?
      <p style={{textAlign: 'center', color: 'green'}} >{msg}</p> : <>

      <input className={styles.editorTitle} type="text" value={title} placeholder="Your post title" onChange={e => setTitle(e.target.value)} />
      <textarea className={styles.editorExcerpt} type="text" value={excerpt} placeholder="A brief about your post" onChange={e => setExcerpt(e.target.value)} />
      <ReactQuill placeholder="Your content goes here..." theme="snow" value={content} onChange={setContent} />
      
      </>
     }
   
    </>
  )
}

export default BlogUpdater