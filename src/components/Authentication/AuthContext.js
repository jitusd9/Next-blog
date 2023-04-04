import {createContext, useContext, useState, useEffect} from 'react'
import { v4 } from 'uuid';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../firebaseInit';
import { saveUserToDB } from '@/utils/database';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export default function AuthContextProvider({ children }) {

  const router = useRouter()

  const [authLoading, setauthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);


  function login(email, password) {

    setauthLoading(true)
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user
      
      setCurrentUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      setauthLoading(false)

      Cookies.set('loggedIn', true);


    }).catch((error) => {
      console.log(error);
      setAuthError(error.message)
      setauthLoading(false)
    })
  }

  function register(username, email, password) {

    setauthLoading(true)

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      // Signed in 
      const user = userCredential.user;
      console.log(user, username, email, password)
      // updating username
      updateProfile(auth.currentUser, {
        displayName: username
      }).then((profile) => {
        saveUserToDB(user)
        setCurrentUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        setauthLoading(false)
        
        Cookies.set('loggedIn', true);

      }).catch(error => {
        console.log('error in profile update');
        setauthLoading(false)
      })
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setAuthError(errorMessage)
      setauthLoading(false)
    });

  }

  function logout(){
    setauthLoading(true)
    signOut(auth).then(() => {
      setCurrentUser(null);
      setauthLoading(false);

      Cookies.remove('loggedIn');
      router.push('/')
    }).catch((error) => {
      setauthLoading(false);
    });
    localStorage.removeItem('user');
  }

  useEffect(() => {

    const savedUser = localStorage.getItem('user');

    if (savedUser){
      console.log(typeof JSON.parse(savedUser))
      setCurrentUser(JSON.parse(savedUser));
      Cookies.set('loggedIn', true);

    }

  },[])

  const value = {
    currentUser,
    authError,
    authLoading,
    setAuthError,
    login,
    logout,
    register,
  }


  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  )
}
