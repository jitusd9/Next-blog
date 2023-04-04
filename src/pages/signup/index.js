import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "@/styles/signup.module.css"
import { useAuth } from "@/components/Authentication/AuthContext"
import { useRouter } from "next/router"
import LoaderComponent from "@/components/Loading"
import withAuth from "@/utils/withAuth"
import LoginForm from "@/components/LoginForm"
import SignupForm from "@/components/SignupForm"

function Index() {

  const {authLoading, authError, setAuthError, register, login, adminLogin } = useAuth();
  const router = useRouter();

  const [switchCard, setSwitchCard] = useState(false);
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [adminPassword, setAdminPassword] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  function handleSignup(e){
    e.preventDefault();

    if(password.length < 6){
      setAuthError('Password must be at least 6 characters')
      return
    }

    if(email && password){
      register(username, email, password)
    }else{
      setAuthError("Please fill the username and password")
    }
  }

  function handleLogin(e){
    e.preventDefault();
    if(adminPassword){
      console.log('admin password')
      adminLogin(adminPassword)
    }else if(email && password){
      login(email, password)
    }else{
      setErrMsg("Please fill the username and password")
    }
  }


  if(authLoading){
    return (
      <div>
      <LoaderComponent />
    </div>
    )
  }

  let loginProps = {
    authError, 
    handleLogin, 
    setAuthError, 
    setEmail, 
    setPassword, 
    setAdminPassword, 
    setSwitchCard
  }

  let signupProps = {
    authError,
    handleSignup, 
    setUsername, 
    setAuthError, 
    setEmail, 
    setPassword, 
    setAdminPassword, 
    setSwitchCard
  }

  return (
    <div> 
    {
      switchCard ?  <SignupForm {...signupProps} /> : <LoginForm {...loginProps} />
    }
    </div>
  )
  
}

export default withAuth(Index)






