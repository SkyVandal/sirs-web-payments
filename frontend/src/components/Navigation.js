import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'

export const Navigation = (props) => {
    return (
        <Navbar sticky="top" bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="ml-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="/login">Sign In</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
        </Container>
  </Navbar>
  )
}