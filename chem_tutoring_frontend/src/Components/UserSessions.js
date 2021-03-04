import React, { useEffect, useState } from 'react'
import { propTypes } from 'react-bootstrap/esm/Image';
import { useParams } from 'react-router-dom'
import { axios_instance } from '..'
import SessionListing from './SessionListing';
import ReactPaginate from 'react-paginate'

const UserSessions = (props) => {
    const { username } = useParams();
    const perPage = 1;
    const [sessions_list, set_sessions_list] = useState({
        raw_sessions: [],
        displayed_sessions: []
    })
    const pageCount = Math.ceil(sessions_list.raw_sessions.length) / perPage;


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
            .then((res) => {
                console.log(res)
                set_sessions_list({
                    raw_sessions: res.data,
                    displayed_sessions: res.data.slice(0, perPage)
                })
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

    const handlePageClick = (e) => {
        let selected = e.selected;
        let offset = Math.ceil(selected * perPage);
        set_sessions_list({ ...sessions_list, displayed_sessions: perPage >= sessions_list.raw_sessions.length ? sessions_list.raw_sessions.slice(offset, sessions_list.raw_sessions.length) : sessions_list.raw_sessions.slice(offset, offset + perPage) })
    };

    console.log(sessions_list)
    const sessions = sessions_list.displayed_sessions.map((session) => (
        <SessionListing key={session._id} session={session} />
    ))

    return (
        <div>
            <h3>Sessions</h3>
            <div className="session_list">
                {sessions.length !== 0 ? sessions : <h3>No sessions scheduled</h3>}
                </div>
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
            />
        </div>
    )
}

export default UserSessions;