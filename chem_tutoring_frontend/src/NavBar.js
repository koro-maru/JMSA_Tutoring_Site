import React, {useState} from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
const NavBar = (props) => {

    const [username, setUsername] = useState(props.username || undefined)
    const history = useHistory();
    const logout = () =>{
        localStorage.clear()
        setUsername(undefined)

    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand>JMSA Tutoring</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
               

                   {username ? (
                       <div >
                    <LinkContainer style={{display:"inline"}} to="/dashboard">
                        <Nav.Link style={{display:"inline"}}> Dashboard</Nav.Link>
                    </LinkContainer>
                        <LinkContainer style={{display:"inline"}} to="/user/create_session">
                            <Nav.Link style={{display:"inline"}}>Create Session</Nav.Link>
                        </LinkContainer>

                        <LinkContainer style={{display:"inline"}} to={`/user/${username}/sessions`}>
                            <Nav.Link>Sessions</Nav.Link>
                        </LinkContainer>

                        <Navbar.Text style={{display:"inline"}}>Signed in as:
                            <LinkContainer style={{display:"inline"}} to={`/user/${username}`}>
                            <Nav.Link style={{display:"inline"}}>{username}</Nav.Link>
                           </LinkContainer>
                        </Navbar.Text>

                        <Link style={{display:"inline"}} onClick={logout}>
                            <Nav.Link style={{display:"inline"}}>Logout</Nav.Link>
                        </Link>
                       </div>) : (
                    <div>
                        <LinkContainer style={{display:"inline"}} to="/sign_in">
                            <Nav.Link>Login</Nav.Link>
                        </LinkContainer>

                        <LinkContainer style={{display:"inline"}} to="/sign_up">
                            <Nav.Link>Sign Up</Nav.Link>
                        </LinkContainer>
                    </div>)}


                 
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;