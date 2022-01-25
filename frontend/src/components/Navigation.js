import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';
import React, {Fragment, useEffect, useState} from "react";


export const Navigation = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setIsAuth(true);
    }
    }, []);

    return (
        <Navbar sticky="top" bg="dark" variant="dark">
            {isAuth === true ? (
            <Fragment>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Link to='/dashboard'>Dashboard</Link>
                    <Link to='/logout'>Logout</Link>
                </Nav>
            </Fragment>
            ) : (
            <Fragment>
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </Nav>
            </Fragment>
            )}
        </Navbar>
  )
}