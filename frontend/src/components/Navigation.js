import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';
import React, {Fragment, useEffect, useState} from "react";
import "./Navigation.css"

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
            <Navbar.Brand className="brand" href="#home">Shop</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link className="link" href="#home">Home</Nav.Link>
                    <Link className="link" to='/dashboard'>Dashboard</Link>
                    <Link className="link" to='/logout'>Logout</Link>
                </Nav>
            </Fragment>
            ) : (
            <Fragment>
                <Navbar.Brand className="brand" href="#home">Shop</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link className="link" href="#home">Home</Nav.Link>
                    <Link className="link" to="/login">Login</Link>
                    <Link className="link" to="/signup">Signup</Link>
                </Nav>
            </Fragment>
            )}
        </Navbar>
  )
}