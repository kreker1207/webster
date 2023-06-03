import React from "react";

import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

export default function ProtectedRoute () {
    const {userInfo} = useSelector((state) => state.auth)

    if(Object.keys(userInfo).length === 0) {
        return (
            <div className='unauthorized' style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 'fit-content', 
                margin: '0 auto', 
                textAlign: 'center'}}>
                <h1>Unauthorized :&#40;</h1>
                <span>
                    <NavLink style={{color: "#FFD100", textDecoration: "underline"}} to='/login'>Login</NavLink> to gain access
                </span>
            </div>
        )
    }

    return <Outlet />
}