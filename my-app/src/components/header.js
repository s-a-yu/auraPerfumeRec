import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "./hooks/AuthProvider";

function AppHeader() {
  const auth = useAuth();
  const { user } = useAuth();
  console.log("user", user);
  console.log("auth", auth);

  return (
    <Navbar
      expand="lg"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        borderBottom: 'none',
        boxShadow: 'none'
      }}
    >
      <Container>
        <Navbar.Brand href="#home">Aura.</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <button onClick={() => auth.logOut()} className="btn-submit">
                  Logout
                </button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login/Register</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppHeader;
