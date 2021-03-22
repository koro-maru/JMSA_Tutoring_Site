import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { axios_instance } from '../index'
import DayPicker from "react-day-picker";
import UserSessions from './UserSessions';
import { Row, Col, Container } from 'react-bootstrap'
import ReactLoading from 'react-loading';
import axios from 'axios';
//View for viewing own profile and someone else viewing profile
const Profile = (props) => {
    let { username } = useParams();
    const [user, set_user] = useState('');
    const [loading, setLoading] = useState(true);
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


        axios_instance.get(`/user/${username}`, config)
            .then((res) => {
                const parsed_dates = res.data.availability.map((date) => {
                    const milliseconds = date.$date;
                    const parsed_date = new Date(milliseconds)
                    return parsed_date;
                })
                res.data.availability = parsed_dates;
                set_user(res.data);
            })
            .then(() => {
                setLoading(false);
            })
    }, [])

    const addDefaultSrc = (e) => {
        e.preventDefault();
        console.log(e.target)
        e.target.src = `http://localhost:5000/profile_pictures/placeholder.jpg`
    }
    return (
        <div>
            <div>
                {loading && <ReactLoading type={"spin"} color={"white"} height={'10%'} width={'10%'} className="loading_spinner" />}
                <h1>{user.full_name}</h1>
                {user.profile_picture ? <img className="profile_picture" src={`http://localhost:5000/${user.profile_picture}`} onError={addDefaultSrc} alt="Profile Picture"></img> : <img className="profile_picture" src="http://localhost:5000/profile_pictures/placeholder.jpg"></img>}
                <h2 className="subtitle">@{username}</h2>
                {
                    username == props.username && (
                        <Link to={{
                            pathname: `/user/${username}/edit`,
                            state: {
                                user: {
                                    ...user
                                }
                            }
                        }}>Edit
                        </Link>)
                }
                <div className="about-div">
                    <p className="bio">{user.biography}</p>
                </div>
                <hr />

                {username == props.username ?
                    <Container>
                        <Row>
                            <Col md="6">
                                <h3>Availability</h3>
                                <DayPicker
                                    className="calendar"
                                    format="MM/DD/YYYY"
                                    selectedDays={user.availability}
                                    name="availability"
                                />
                            </Col>
                            <Col md="6" className="user_sessions">
                                {username == props.username && <div><h3>Sessions</h3><UserSessions /></div>}
                            </Col>
                        </Row>
                    </Container>
                    : <div>
                        <h3>Availability</h3>
                        <DayPicker
                            className="calendar"
                            format="MM/DD/YYYY"
                            selectedDays={user.availability}
                            name="availability"
                        />
                    </div>}
            </div>
        </div>
    )

}

export default Profile;