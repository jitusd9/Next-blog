import { useState } from "react"
import styles from "@/styles/signup.module.css"

const LoginForm = ({authError, handleLogin, setAuthError, setEmail, setPassword, setAdminPassword, setSwitchCard}) => {
  
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <>
      <form className={styles.form} onSubmit={handleLogin}>

      {
        authError ? <div className={styles.errMsg}>
          <p>{authError}</p>
        </div> : null
      }

     {
      isChecked ? null : <>
          <label htmlFor="email">
            Email : <input type="email" id="email" onChange={e => {
              setAuthError(null)
              setEmail(e.target.value)
            }} />
          </label>

          <label htmlFor="password">
            Password : <input type="password" id="password" onChange={e => {
              setAuthError(null)
              setPassword(e.target.value)
            }} />
          </label>
      </>
     }

      <label htmlFor="admin">
        <input type="checkbox" id="admin" onChange={e => setIsChecked(e.target.checked)} /> Are you Admin?
      </label>

      {
        isChecked ? <label htmlFor="password">
        Admin Password : <input type="password" id="password" onChange={e => {
          setAuthError(null)
          setAdminPassword(e.target.value)
        }} />
      </label> : null
      }

      <button type="submit">Login</button>
        <p className={styles.flipcard} onClick={() => setSwitchCard(true)}>New user? create account here</p>
      </form>
    </>
  )
}

export default LoginForm