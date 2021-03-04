import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { axios_instance } from '../index'
import DayPicker from "react-day-picker";
import UserSessions from './UserSessions';
import { Row, Col, Container } from 'react-bootstrap'
//View for viewing own profile and someone else viewing profile
const Profile = (props) => {
    let { username } = useParams();
    const [user, set_user] = useState('');

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
                return res.data
            }).then((res) => {
                set_user(res);
            }).then(console.log(user))
    }, [])


    return (
        <div>
            <div>
                <h1>{user.full_name}</h1>
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
                                {username == props.username && <UserSessions />}
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