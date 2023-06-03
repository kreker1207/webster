import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MainPage from './components/Main/MainPage';
import Register from './pages/Register'
import Login from './pages/Login';
import Header from './components/Header';
import ConfirmEmail from './pages/ConfirmEmail';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchProfile } from './utils/authActions';
import Redactor from './components/Redactor/Redactor';
import AccountPage from './components/Account/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)
  useEffect(() => {
      const updateToken = async () => {
        const data = await dispatch(fetchProfile())
        if (Object.keys(userInfo).length !== 0 && 'accessToken' in userInfo) {
          window.localStorage.setItem('accessToken', data.payload.accessToken)
        } 
    }
    updateToken()
    // eslint-disable-next-line
  }, [])
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route exact path='/confirmEmail/:activationToken' element={ <ConfirmEmail/> } />
          <Route element = {<ProtectedRoute/>}>
            <Route path='/account' element ={<AccountPage/>}/>
          </Route>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/redactor' element={<Redactor/>}/>
          </Route>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/redactor/:id' element={<Redactor/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
