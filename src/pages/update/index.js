import { LoginRequired } from '@/utils/withAuth'
import BlogUpdater from '@/components/BlogUpdater'
import { useRouter } from 'next/router'

const Index = () => {

  const router = useRouter()

 

  return (
    <div>
      <BlogUpdater id={router.query.id} />
    </div>
  )
}

export default LoginRequired(Index)