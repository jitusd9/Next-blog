import { useState } from "react";
import styles from "@/styles/signup.module.css"

const SignupForm = ({authError, handleSignup, setUsername, setAuthError, setEmail, setPassword, setAdminPassword, setSwitchCard}) => {

  const [isChecked, setIsChecked] = useState(false)

  return (
        <>
          <form className={styles.form} onSubmit={handleSignup}>
          <h4 style={{textAlign: 'center'}}>Sign Up</h4>
          {
            authError ? <div className={styles.errMsg}>
              <p  style={{textAlign: 'center'}}>{authError}</p>
            </div> : null
          }

          {
            !isChecked ? 
            <>

            <label htmlFor="username">
              Username : <input type="text" id="username" onChange={e => {
                setAuthError(null)
                setUsername(e.target.value)
              }} />
            </label>

            <label htmlFor="email">
              Email : <input type="email" id="email" onChange={e => {
                setAuthError(null)
                setEmail(e.target.value)
              }} />
            </label>
            
            <label htmlFor="password">
              Password : <input type="password" id="password" placeholder="minimum length 6" onChange={e => {
                setAuthError(null)
                setPassword(e.target.value)
              }} />
            </label>
            </> : null
          }

          {/* <label htmlFor="admin">
            <input type="checkbox" id="admin" onChange={e => setIsChecked(e.target.checked)} /> Are you Admin?
          </label>

          {
            isChecked ?
              <label htmlFor="password">
                Admin Password : <input type="password" id="password" onChange={e => {
                  setAuthError(null)
                  setAdminPassword(e.target.value)
                }} />
              </label>
            : null
          } */}

          <button type="submit">Signup</button>

          <p className={styles.flipcard} onClick={() => setSwitchCard(false)}>Already have an account? Login here</p>

          </form>
        </>
  )

}

export default SignupForm