import { useState } from "react"
import 'react-quill/dist/quill.snow.css';
import { auth } from "../../firebaseInit";
import styles from "@/styles/editor.module.css"
import LoaderComponent from "./Loading";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import('react-quill'), { ssr: false })

function BlogEditor({
  setTitle,
  setAuthor,
  setContent,
  setExcerpt,
  content
}) {

  


  return (
    <>

     
      <input className={styles.editorTitle} type="text" placeholder="title" onChange={e => setTitle(e.target.value)} />
      <textarea className={styles.editorExcerpt} type="text" placeholder="excerpt" onChange={e => setExcerpt(e.target.value)} />
      <ReactQuill theme="snow" value={content} onChange={setContent} />
    </>
  )
}

export default BlogEditor