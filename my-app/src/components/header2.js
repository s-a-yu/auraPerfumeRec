import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "./hooks/AuthProvider";

function Header2() {
  const auth = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (window.location.pathname !== "/") {
      // Navigate to home first, then scroll to the section
      navigate("/");
      setTimeout(() => {
        window.location.hash = path;
      }, 100); // Slight delay to ensure the page loads before setting the hash
    } else {
      // Directly navigate to the section
      window.location.hash = path;
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => handleNavigation("#home")}>
          Aura.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavigation("#home")}>Home</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#about")}>About</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#services")}>
              Services
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#explore")}>
              Explore
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#scent-quiz")}>
              Quiz
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#teams")}>Team</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#testimonials")}>
              Testimonials
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <button onClick={() => auth.logOut()} className="btn-submit">
                  Logout
                </button>
              </>
            ) : (
              <Nav.Link as="div" onClick={() => navigate("/login")}>
                Login/Register
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header2;
