import styles from '@/styles/blogpage.module.css'
import { useRouter } from "next/router"
import { useAuth } from '@/components/Authentication/AuthContext';
import { getPostBySlug, createComment, getCommentsByPost } from '@/utils/database';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import LoaderComponent from '@/components/Loading';

function Post({post}) {

  const { currentUser } = useAuth()
  const router = useRouter();

  const [loading,setLoading] = useState(false);
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState(null)

  const handleComment = async () =>{
    setLoading(true);
    if(comment){
      console.log(comment,currentUser.uid, post.id)
      const response = await createComment(comment, currentUser.uid, post.id)
      console.log(response)
      fetchComments();
      setLoading(false)
    }

  }

  const fetchComments = async () => {
    const response = await getCommentsByPost(post.id)

    if(response !== 404){
      setComments(response)
    }

  }

  useEffect(() => {

    fetchComments();
   
  }, []);

  return (
    <div className={styles.blogpage}>
      <h1 className={styles.title}>{post.title}</h1>
      <p  className={styles.author}>by {post.author}</p>
      <div  className={styles.excerpt} dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <div  className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
     
        <div className={styles.commentbox}>
        <h4>Comments</h4>

        {
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <h3 className={styles.commentContent}>{comment.content}</h3>
              <p> {formatDistanceToNow(comment.createdAt.toDate())} ago by jitu</p>
            </div>
          ))
        }

        {
          loading ? <LoaderComponent /> : <div className={styles.commentform}>
          <textarea placeholder="comment here..." className={styles.commentform} onChange={
            (e) => setComment(e.target.value)} />
          {
            currentUser ? <button onClick={handleComment} className={styles.commentBtn}>comment as {currentUser.displayName}</button> : <Link href="/signup" className={styles.commentBtn}>Login to Comment</Link>
          }
        </div>
        }


      </div>
     

    </div>
  )
}

export default Post

export async function getServerSideProps(context) {

  const slug = context.query

  const post = await getPostBySlug(slug.slug);

  return {
    props: { post },
  };
}