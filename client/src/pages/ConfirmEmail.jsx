import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/apiSetting'
import styled from 'styled-components'
function ConfirmEmail() {
    const params = useParams()
    const [state, setState] = useState({loading: true, success: false})

    useEffect(() => {
        api.get(`/confirmEmail/${params.activationToken}`)
            .then(response => {
                console.log(response.data)
                setState({
                    loading: false,
                    success: true,
                })
            })
            .catch(error => {
                setState({
                    loading: false,
                    success: false,
                })
            })
    }, [params.activationToken])
    return (
        <Confirmed>
            {
                state.loading ? 
                <h2 style={{textAlign: 'center'}}>Activating...</h2> :
                <div> 
                    {
                        state.success ? 
                        <div className='info'>
                            <div className={'circle'}><div><img src={require('../components/assets/emailConfirm.png')} alt="confirmed" /></div></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}>Email has been succesfully <br/> <span style={{color: '#6D9886'}}>confirmed</span></div>
                        </div>
                        :
                        <div className='info'>
                            <div className={'circle'}><img src={require('../components/assets/emailReject.png')} alt="rejected" /></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}>Some error has<br/><span style={{color: '#FF6F6F'}}>happened</span></div>
                        </div>
                    }
                </div>
            }
        </Confirmed>
    )
    
}
const Confirmed = styled.div`
    max-width: 600px;
    margin: 20vh auto;
    border: 2px solid #393E46;
    border-radius: 30px;
    .info {
        max-width: 500px;
        margin: 10px auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        .circle {
            width: 300px;
            height: 300px;
            background: #6D9886;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            margin-bottom: 10px;
            img {
                width: 230px;
                height: 230px;
            }
        }
    }`
export default ConfirmEmail
