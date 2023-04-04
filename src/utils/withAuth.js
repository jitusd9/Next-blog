import { useRouter } from 'next/router';
import { useAuth } from '@/components/Authentication/AuthContext';

 const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    
    const {currentUser} = useAuth()

    if (!currentUser) {
      
      return <Component {...props} />;
    }else{
      router.push('/');
      return null;
    }
  };
  return Auth;
};

export default withAuth