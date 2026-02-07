import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ScentQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    style: '',
    family: '',
    intensity: ''
  });
  const [recommendation, setRecommendation] = useState(null);

  const recommendations = {
    masculine: {
      woody: {
        subtle: { name: 'Tom Ford Grey Vetiver', description: 'A refined, subtle woody fragrance' },
        strong: { name: 'Creed Aventus', description: 'A bold, powerful woody scent' }
      },
      spicy: {
        subtle: { name: 'Maison Margiela Replica Jazz Club', description: 'A warm, subtle spicy fragrance' },
        strong: { name: 'Viktor & Rolf Spicebomb Extreme', description: 'An intense, explosive spicy scent' }
      },
      aquatic: {
        subtle: { name: 'Giorgio Armani Acqua di Giò', description: 'A fresh, light aquatic fragrance' },
        strong: { name: 'Yves Saint Laurent Y Eau de Parfum', description: 'A vibrant, strong aquatic scent' }
      }
    },
    feminine: {
      floral: {
        subtle: { name: 'Chanel Chance Eau Tendre', description: 'A delicate, romantic floral fragrance' },
        strong: { name: 'Yves Saint Laurent Libre', description: 'A bold, elegant floral scent' }
      },
      gourmand: {
        subtle: { name: 'Hugo Boss The Scent For Her', description: 'A sweet, understated gourmand fragrance' },
        strong: { name: 'Yves Saint Laurent Black Opium', description: 'An addictive, intense gourmand scent' }
      },
      oriental: {
        subtle: { name: 'Bvlgari Omnia Amethyste', description: 'A soft, mysterious oriental fragrance' },
        strong: { name: 'Tom Ford Black Orchid', description: 'A luxurious, powerful oriental scent' }
      }
    }
  };

  const handleStyleSelect = (style) => {
    setAnswers({ ...answers, style });
    setStep(2);
  };

  const handleFamilySelect = (family) => {
    setAnswers({ ...answers, family });
    setStep(3);
  };

  const handleIntensitySelect = (intensity) => {
    setAnswers({ ...answers, intensity });
    const result = recommendations[answers.style][answers.family][intensity];
    setRecommendation(result);
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ style: '', family: '', intensity: '' });
    setRecommendation(null);
  };

  const familyOptions = {
    masculine: [
      { value: 'woody', label: 'Woody', description: 'Earthy, warm notes like sandalwood and cedar' },
      { value: 'spicy', label: 'Spicy', description: 'Bold notes like cinnamon, pepper, and cardamom' },
      { value: 'aquatic', label: 'Aquatic', description: 'Fresh, clean oceanic and marine notes' }
    ],
    feminine: [
      { value: 'floral', label: 'Floral', description: 'Romantic notes like rose, jasmine, and peony' },
      { value: 'gourmand', label: 'Gourmand', description: 'Sweet, edible notes like vanilla and caramel' },
      { value: 'oriental', label: 'Oriental', description: 'Exotic notes like amber, musk, and spices' }
    ]
  };

  return (
    <section id="scent-quiz" className="block scent-quiz-block">
      <Container fluid>
        <div className="title-holder">
          <h2>Scent Quiz</h2>
          <div className="subtitle">find your perfect fragrance</div>
        </div>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="quiz-card" style={{ border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <Card.Body style={{ padding: '40px' }}>
                {step === 1 && (
                  <div className="quiz-step">
                    <h4 className="mb-4">Which fragrance style do you prefer?</h4>
                    <div className="d-grid gap-3">
                      <Button
                        variant="outline-dark"
                        size="lg"
                        onClick={() => handleStyleSelect('masculine')}
                        style={{ padding: '15px' }}
                      >
                        Masculine
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="lg"
                        onClick={() => handleStyleSelect('feminine')}
                        style={{ padding: '15px' }}
                      >
                        Feminine
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="quiz-step">
                    <h4 className="mb-4">Choose your scent family</h4>
                    <div className="d-grid gap-3">
                      {familyOptions[answers.style].map((option) => (
                        <Button
                          key={option.value}
                          variant="outline-dark"
                          size="lg"
                          onClick={() => handleFamilySelect(option.value)}
                          style={{ padding: '15px', textAlign: 'left' }}
                        >
                          <div>
                            <strong>{option.label}</strong>
                            <div style={{ fontSize: '0.9em', opacity: 0.7, marginTop: '5px' }}>
                              {option.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setStep(1)}
                      className="mt-3"
                    >
                      ← Back
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="quiz-step">
                    <h4 className="mb-4">What level of fragrance intensity do you prefer?</h4>
                    <div className="d-grid gap-3">
                      <Button
                        variant="outline-dark"
                        size="lg"
                        onClick={() => handleIntensitySelect('subtle')}
                        style={{ padding: '15px' }}
                      >
                        Subtle
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="lg"
                        onClick={() => handleIntensitySelect('strong')}
                        style={{ padding: '15px' }}
                      >
                        Strong
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setStep(2)}
                      className="mt-3"
                    >
                      ← Back
                    </Button>
                  </div>
                )}

                {step === 4 && recommendation && (
                  <div className="quiz-step text-center">
                    <h4 className="mb-4" style={{ color: '#28a745' }}>Your Perfect Match!</h4>
                    <div style={{
                      padding: '30px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '10px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{ marginBottom: '15px' }}>{recommendation.name}</h3>
                      <p style={{ fontSize: '1.1em', color: '#6c757d' }}>
                        {recommendation.description}
                      </p>
                    </div>
                    <div className="d-grid gap-2">
                      <Button
                        variant="dark"
                        size="lg"
                        onClick={resetQuiz}
                      >
                        Take Quiz Again
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <hr style={{ margin: '10px 0', borderTop: '1px solid #e6e6e6' }} />
      </Container>
    </section>
  );
}

export default ScentQuiz;
