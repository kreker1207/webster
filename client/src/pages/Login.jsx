import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from '../utils/authActions';
import { NavLink, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FaLock, FaUser } from 'react-icons/fa';
import { IconContext } from 'react-icons';

export default function Login() {
  const { loading, userInfo } = useSelector((state) => state.auth)
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
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

  useEffect( () => {
    if(Object.keys(userInfo).length !== 0) {
      navigate(`/`)
    }
  }, [navigate, userInfo] )

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(handleValidation()) {
        const response = await dispatch(fetchLogin({login, password}))
        // console.log(response)
        if(response.type === 'auth/fetchLogin/rejected') {
          throw(response.payload)
        }
      }
    } catch (error) {
      handleValidation(error)
    }
  };

  const handleValidation = (serverError) => {
    if (login === "") {
      toast.error("Login and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Login and Password is required.", toastOptions);
      return false;
    } else if (serverError) {
      toast.error(serverError, toastOptions);
      return false;
    }
    return true;
  }


  return (
    <FormContainer>
      <div className='formName'>Login</div>
      <form onSubmit={handleSubmit}>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
              <div className="input-container">
                <FaUser style={{marginRight: '10px'}}/> <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
              </div>
          </IconContext.Provider>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle'} }}>
            <div className="input-container">
              <FaLock style={{marginRight: '10px'}}/> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            </div>
          </IconContext.Provider>
          <div className='reset-password'>Forgot your password?</div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
      </form>
      <div className='register'>Don't have an accout? <NavLink to='/register'>Sign Up</NavLink> !</div>
      <ToastContainer/>
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
  .register {
    width: 100%;
    text-align: end;
    font-size: 12px;
    color: #848484;
  }
`;