import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { getAllPosts, getAllPostsPerPage } from '@/utils/database'
import { useRouter } from 'next/router'
import { useAuth } from '@/components/Authentication/AuthContext'
import BlogCard from '@/components/BlogCard'
import LoaderComponent from '@/components/Loading'

export default function Home({posts, firstVisible, lastVisible}) {

  const router = useRouter()
  const { currentUser, logout } = useAuth();

  if (router.isFallback) {
    return <LoaderComponent />
  }

  const loadMore = async () => {
    // Reload the page with the next set of documents by adding the lastVisible ID to the query params
    const nextPageUrl = `/?firstVisible=${firstVisible}&lastVisible=${lastVisible}`;
    window.location.href = nextPageUrl;
  };

  return (
    <>

        <div className={styles.blogList}>
          {
            posts.length > 0 ? posts.map((post, index) =>(
              <Link key={post.id} href={`/blog/${encodeURIComponent(post.slug)}`}>
                <BlogCard key={post.id} post={post} />
              </Link> 
            )) : <p style={{color: '#555', textAlign : 'center'}}>No Post Available</p>
          }
          
       {
         posts.length > 0 ?  <div className={styles.pagination}>

         {
           firstVisible === undefined ? <p className={styles.disabled}>prev</p> : <Link href={`/?firstVisible=${firstVisible}`}>prev</Link>
         }

         {
           posts.length < 3 ? <p className={styles.disabled}>next</p> : <Link href={`/?lastVisible=${lastVisible}`}>next</Link>
         }
       </div> : null
       }
        </div>
    </>
  )
}


export async function getServerSideProps(context) {
  // const posts = await getAllPosts();

  const {prev, firstVisible, lastVisible } = context.query
  
  const data = await getAllPostsPerPage(firstVisible, lastVisible)

  // console.log('lastVisible', data.lastVisible)

  return {
    props: { posts: data.posts, firstVisible: data.firstVisible, lastVisible: data.lastVisible },
  };
}
