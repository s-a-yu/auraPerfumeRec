import React, { useEffect, useState } from 'react';
import AppHeader from "./header";
import { useAuth } from './hooks/AuthProvider';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Dashboard = () => {
  const auth = useAuth();
  const email = auth.user?.email;

  const [favoriteFragrances, setFavoriteFragrances] = useState([]);

  const getUsersFavoriteFragrances = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/frag/user/favorites?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log("res", res);
      if (res) {
        console.log("Retrieved user's favorite fragrances", res.message);
        setFavoriteFragrances(res);
        console.log("favorite frags", favoriteFragrances);
        return;
      }
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const removeFragranceFromUser = async (fragName) => {
    try {
      const response = await fetch("http://localhost:8080/api/frag/remove/user/fragrance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, Name: fragName }),
      });
      const res = await response.json();
      console.log("res", res);
      if (res.message) {
        console.log("fragrance removed message", res.message);
        setFavoriteFragrances(favoriteFragrances.filter(frag => frag.Name !== fragName));
        alert(res.message);
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsersFavoriteFragrances();
  }, []);

  return (
    <div>
      <header id="header">
        <AppHeader />
      </header>

      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        padding: '100px 20px 60px'
      }}>
        <Container fluid style={{ maxWidth: '1400px' }}>
          <div style={{ marginBottom: '60px', paddingLeft: '20px' }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '12px',
              letterSpacing: '-1px',
              lineHeight: '1.2'
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6b6b6b',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Your personal fragrance collection
            </p>
          </div>

          <Row>
            <Col>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '400',
                color: '#1a1a1a',
                marginBottom: '40px',
                paddingLeft: '20px',
                letterSpacing: '-0.5px'
              }}>
                Saved Fragrances
              </h2>

              {favoriteFragrances.length > 0 ? (
                <Row>
                  {favoriteFragrances.map((fragrance, index) => (
                    <Col md={6} lg={4} key={index} className="mb-4">
                      <Card style={{
                        border: 'none',
                        borderRadius: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        height: '100%',
                        backgroundColor: '#ffffff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }}>
                        <Card.Body style={{ padding: '32px' }}>
                          <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                              fontSize: '22px',
                              fontWeight: '500',
                              color: '#1a1a1a',
                              margin: 0,
                              marginBottom: '8px',
                              letterSpacing: '-0.3px'
                            }}>
                              {fragrance.Name}
                            </h3>
                            <p style={{
                              fontSize: '15px',
                              color: '#6b6b6b',
                              margin: 0,
                              fontWeight: '400'
                            }}>
                              {fragrance.Brand}
                            </p>
                          </div>

                          <div style={{
                            padding: '18px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '16px',
                            marginBottom: '20px'
                          }}>
                            <p style={{
                              fontSize: '11px',
                              color: '#95a5a6',
                              margin: 0,
                              marginBottom: '8px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.8px',
                              fontWeight: '600'
                            }}>
                              Fragrance Notes
                            </p>
                            <p style={{
                              fontSize: '14px',
                              color: '#2c3e50',
                              margin: 0,
                              lineHeight: '1.6'
                            }}>
                              {fragrance.Notes}
                            </p>
                          </div>

                          {fragrance.Images && fragrance.Images.length > 0 && (
                            <div style={{
                              marginBottom: '16px',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              backgroundColor: '#f8f9fa',
                              padding: '10px',
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={fragrance.Images[0]}
                                alt={fragrance.Name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '150px',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                          )}

                          <Button
                            onClick={() => removeFragranceFromUser(fragrance.Name)}
                            style={{
                              width: '100%',
                              padding: '14px 24px',
                              fontSize: '14px',
                              fontWeight: '500',
                              backgroundColor: 'transparent',
                              border: '2px solid #e74c3c',
                              color: '#e74c3c',
                              borderRadius: '50px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#e74c3c';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#e74c3c';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            Remove from Collection
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card style={{
                  border: 'none',
                  borderRadius: '24px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                  padding: '80px 40px',
                  backgroundColor: '#ffffff',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '24px'
                  }}>
                    🌸
                  </div>
                  <h3 style={{
                    color: '#1a1a1a',
                    marginBottom: '16px',
                    fontSize: '28px',
                    fontWeight: '400',
                    letterSpacing: '-0.5px'
                  }}>
                    No fragrances saved yet
                  </h3>
                  <p style={{
                    color: '#6b6b6b',
                    fontSize: '16px',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                  }}>
                    Start building your collection by exploring recommendations
                  </p>
                  <Button
                    href="/"
                    style={{
                      padding: '16px 48px',
                      fontSize: '16px',
                      fontWeight: '500',
                      backgroundColor: '#3d4f5c',
                      border: 'none',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(61, 79, 92, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2c3d47';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(61, 79, 92, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3d4f5c';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(61, 79, 92, 0.2)';
                    }}
                  >
                    Get Recommendations
                  </Button>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Dashboard;
