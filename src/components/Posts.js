import Link from "next/link"

export default function Posts({posts}) {
  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
