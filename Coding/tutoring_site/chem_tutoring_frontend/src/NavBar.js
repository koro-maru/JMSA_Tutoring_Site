import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav } from 'react-bootstrap'
const NavBar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand>JMSA Tutoring</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>

                    <LinkContainer to="/dashboard">
                        <Nav.Link>Dashboard</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/sign_up">
                        <Nav.Link>Sign Up</Nav.Link>
                    </LinkContainer>

                   <Navbar.Text>Signed in as:<Nav.Link style={{display:"inline"}}>Mark Otto</Nav.Link> </Navbar.Text>
                 
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;