import { useState } from "react";
import { useAuth } from './hooks/AuthProvider';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const auth = useAuth();
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      auth.loginAction(input);
      return;
    }
    alert("Please provide a valid input");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      padding: '100px 20px 60px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '38px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                Welcome Back
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#7f8c8d',
                margin: 0
              }}>
                Login to access your fragrance collection
              </p>
            </div>

            <Card style={{
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
              <Card.Body style={{ padding: '40px' }}>
                <Form onSubmit={handleSubmitEvent}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{
                      color: '#2c3e50',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      value={input.email}
                      onChange={handleInput}
                      required
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{
                      color: '#2c3e50',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={input.password}
                      onChange={handleInput}
                      required
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2c3e50'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      backgroundColor: '#2c3e50',
                      border: 'none',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
                      marginBottom: '20px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1a252f';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(44, 62, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#2c3e50';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(44, 62, 80, 0.2)';
                    }}
                  >
                    Login
                  </Button>

                  <div style={{
                    textAlign: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: '15px' }}>
                      Don't have an account?{' '}
                      <Link to="/register" style={{
                        color: '#2c3e50',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}>
                        Register now
                      </Link>
                    </p>
                    <p style={{ marginTop: '12px', marginBottom: 0 }}>
                      <Link to="/" style={{
                        color: '#7f8c8d',
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}>
                        ← Back to Home
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
