import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from '../utils/authActions';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { IconContext } from 'react-icons';

export default function Register() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { loading, success } = useSelector((state) => state.register)
  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const footer = document.getElementById('footer')
    const root = document.getElementById('root')
    root.style.height = '100vh'
    footer.style.display = 'none'
  }, [])

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (success) navigate('/login')
    // redirect authenticated user to profile screen
    if (Object.keys(userInfo).length !==0) navigate(`/user-profile`)
  }, [navigate, userInfo, success])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(handleValidation()) {
        const response = await dispatch(fetchRegister({login, email, password}))
        console.log(response)
        if(response.type === 'auth/fetchRegister/rejected') {
          throw(response.payload)
        }
        alert('Please, confirm your email')
      }
    } catch (error) {
      handleValidation(error)
    }

  };

  const handleValidation = (error) => {
    if (password !== passwordConfirm) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (login.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (error) {
      toast.error(error, toastOptions);
      return false;
    }
    return true;
  }

  return (
      <FormContainer>
        <div className='formName'>Register</div>
        <form onSubmit={handleSubmit}>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
            <div className="input-container">
              <FaEnvelope style={{marginRight: '10px'}}/> <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
            <div className="input-container">
              <FaUser style={{marginRight: '10px'}}/> <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Username" />
            </div>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
            <div className="input-container">
              <FaLock style={{marginRight: '10px'}}/> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            </div>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
            <div className="input-container">
              <FaLock style={{marginRight: '10px'}}/> <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Repeat password"/>
            </div>
          </IconContext.Provider>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <div className='login'>Already have an account? <NavLink to='/login'>Sign In</NavLink> !</div>
        <ToastContainer />
      </FormContainer>
  )
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: fit-content;
  min-height: calc(100vh - 70px);

  .formName {
    text-align: center;
    margin-bottom: 70px;
    font-size: 32px;
  }

  form {  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .input-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #fff;
      input {
        outline: none;
        background: rgb(51, 51, 51);
        border: none;
        color: #fff;
      }
    }

    .reset-password {
      width: 100%;
      text-align: end;
      font-size: 12px;
      color: #848484;
      margin-top: -15px;
    }

    button {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
      background: #FFD100;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  }
  .login {
    width: 100%;
    text-align: end;
    font-size: 12px;
    color: #848484;
  }
`;