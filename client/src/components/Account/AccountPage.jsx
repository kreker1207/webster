import React, { useEffect, useState } from 'react'
import './AccountStyle.scss'
import api from '../../utils/apiSetting';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLogout } from '../../utils/authActions';

function AccountPage() {
    const [projects, setProjects] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        api.get('/projects')
            .then(response => {
                console.log(response.data)
                setProjects(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleProjectClick = (id) => {
        navigate(`/redactor/${id}`)
    }

    const handleDeleteProject = (id) => {
        api.delete(`/project/${id}`)
        .then(response =>{
            window.location.reload()
        }).catch(error=>{console.log(error.message)})

    }

    const handleLogout = () => {
        dispatch(fetchLogout())
        console.log('here')
    }

    return (
        <div>
            <div className='nav'>
                <div className="logo left in">
                    <a href='/'style={{ fontSize: '18px' }}>Create a Graphic</a>
                    <a href='/account'style={{ fontSize: '18px' }}>Saved Graphic</a>
                </div>
                <div className="menu right bebrosic">
                    <div className="menu dropdown loged">
                        <button className="dropbtn" style={{ fontSize: '18px' }}>Help <i className="bi bi-caret-down-fill"></i></button>
                            <div className="dropdown-content">
                                <button   className='drp-btn'><i className="bi bi-envelope-open"></i> Contact us</button>
                                <button   className='drp-btn'><i className="bi bi-camera-video"></i> Video tutorial</button>
                            </div>            

                </div>
                <div className="menu dropdown loged2">
                    <button className="dropbtn" style={{ fontSize: '16px' }}>My account <i className="bi bi-caret-down-fill"></i></button>
                    <div className="dropdown-content">
                        <button className='drp-btn'><i className="bi bi-briefcase-fill"></i> Profile</button>
                        <button onClick={handleLogout} className='drp-btn'><i className="bi bi-box-arrow-left"></i> Log out</button>
                    </div>            
                        </div>
            </div> 
        </div>
        <div className='main-body'>
            <div className='orange-line'>
                <h1>Account</h1>
            </div>
            <div className='account-body'>
                <h2>Your account</h2>
            </div>
            <div className='account-wrapper'>
                <div className='account'>
                    <div className='input login' placeholder="Your login">
                        <h3>Login</h3>
                        <input type={"text"} placeholder="Your login"></input>        
                    </div>
                    <div className='input mail' >
                        <h3>Email</h3>
                        <input type={"text"}placeholder="Your email address"></input>        
                    </div>
                    <div className='input password'>
                        <h3>Password</h3>
                        <input type={"password"} placeholder="Your password"></input>    
                    </div>
                    <div className='input'>
                        <button className='button-19 orange'>Save Changes</button>
                    </div>
                </div>
                <div className='projects'>
                    {
                        projects.map((item, index) => {
                            return (
                                <div className='project' key={index}>
                                    <img src={require('../assets/project.png')}/>
                                    <p>{item.project_name}</p>
                                    <div>
                                        <button onClick={e => handleProjectClick(item.id)} className='button-19'>Edit</button>
                                        <i onClick={e => handleDeleteProject(item.id)} className="bi bi-trash"></i>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </div> 

    )
}

export default AccountPage
