import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import LoaderComponent from './Loading'
import { deletePost } from '@/utils/database'

function BlogCard({post, from}) {
 
  const [loading, setLoading] = useState(false)

  async function handleDelete(id){
    setLoading(true)
    const res = await deletePost(id)
    console.log(res)
    setLoading(false)
  }

  return (
    <>
    {
      loading ? <LoaderComponent /> : <div className={styles.blogCard}>
      <div className={styles.blogTitle}>
        <h3>{post.title}</h3>
        <div  className={styles.credit}>
          <p  className={styles.blogAuthor}>by {post.author} | </p>
          <p  className={styles.blogTime}>&nbsp;{post.createdAt}</p>
        </div>
      </div>
      <div className={styles.blogExerpt}>
      <div  className={styles.excerpt} dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      </div>
      {
        from === 'dashboard' ? <div  className={styles.btns}>
          <button style={{background: 'black'}}>Edit</button>
          <button  style={{background: '#c90b0b'}} onClick={() => handleDelete(post.id)}>Delete</button>
        </div> : null
      }
    </div>
    }
    </>
  )
}

export default BlogCard
