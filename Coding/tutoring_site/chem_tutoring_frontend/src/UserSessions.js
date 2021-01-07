import React, { useEffect, useState } from 'react'
import { propTypes } from 'react-bootstrap/esm/Image';
import {useParams} from 'react-router-dom'
import { axios_instance } from '.'
import SessionListing from './SessionListing';

const UserSessions = (props) => {
    const { username} = useParams();
    const [sessions_list, set_sessions_list] = useState([])

    useEffect(() => {
        const config = {
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios_instance.get(`http://127.0.0.1:5000/user/${username}/sessions`, config)
        .then((res)=>{
            console.log(res)
            set_sessions_list(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [])

    console.log(sessions_list)
    const sessions = sessions_list.map((session)=>(
        <SessionListing key={session._id} session={session}/>
    ))

    return (
        <div>
            <h1>HI</h1>
            {sessions}
        </div>
    )
}

export default UserSessions;