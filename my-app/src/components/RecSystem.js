import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDeepResearch } from '../hooks/useDeepResearch';

// Define the list of available notes for selection with colors
const notesOptions = [
    { value: 'vanilla', label: 'Vanilla', emoji: '🌸', color: '#f9e4d4' },
    { value: 'musk', label: 'Musk', emoji: '🦌', color: '#d4b5a0' },
    { value: 'lavender', label: 'Lavender', emoji: '💜', color: '#d4c5f9' },
    { value: 'rose', label: 'Rose', emoji: '🌹', color: '#ffd4e5' },
    { value: 'citrus', label: 'Citrus', emoji: '🍊', color: '#ffe4b3' },
    { value: 'amber', label: 'Amber', emoji: '🍯', color: '#f4d6a0' },
    { value: 'sandalwood', label: 'Sandalwood', emoji: '🌲', color: '#d4e5d4' },
    { value: 'jasmine', label: 'Jasmine', emoji: '🌼', color: '#fff4d4' }
];


const saveFragranceToUser = async (email, data) => {
    try {
        const response = await fetch("http://localhost:8080/api/frag/save/user/fragrance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, ...data }),
        });
        const res = await response.json();
        if (res.message) {
            alert(res.message);
            return;
        }
        throw new Error(res.message);
    } catch (err) {
        console.error(err);
    }
};

const handleSaveFragrance = (fragrance) => {
    const email = localStorage.getItem('email');
    if (email) {
      saveFragranceToUser(email, fragrance);
    } else {
        alert("In order to save a fragrance, you must be logged in.");
    }
};

function RecSystem() {
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Deep research state
    const [isDeepResearch, setIsDeepResearch] = useState(false);
    const [additionalPreferences, setAdditionalPreferences] = useState('');

    // Deep research hook
    const {
        startResearch,
        cancelResearch,
        isLoading: deepLoading,
        status: deepStatus,
        progress: deepProgress,
        message: deepMessage,
        recommendations: deepRecommendations,
        error: deepError
    } = useDeepResearch();

    // Combined loading state
    const isAnyLoading = loading || deepLoading;

    // Update recommendations when deep research completes
    useEffect(() => {
        if (deepRecommendations.length > 0) {
            setRecommendations(deepRecommendations);
        }
    }, [deepRecommendations]);

    const toggleNote = (note) => {
        setSelectedNotes(prev => {
            const isSelected = prev.some(n => n.value === note.value);
            if (isSelected) {
                return prev.filter(n => n.value !== note.value);
            } else {
                return [...prev, note];
            }
        });
    };

    const isNoteSelected = (noteValue) => {
        return selectedNotes.some(n => n.value === noteValue);
    };

    const getRecommendations = () => {
        if (selectedNotes.length === 0) {
            alert('Please select at least one scent note');
            return;
        }

        if (isDeepResearch) {
            // Use deep research
            const noteValues = selectedNotes.map(note => note.value);
            startResearch(noteValues, additionalPreferences);
        } else {
            // Existing TF-IDF logic
            setLoading(true);
            const apiUrl = 'http://127.0.0.1:5000/recommend';
            const notesString = selectedNotes.map(note => note.value).join(', ');

            axios.get(apiUrl, {
                params: {
                    notes: notesString,
                    n: 3
                }
            })
            .then(response => {
                setRecommendations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                alert('Unable to fetch recommendations. Please make sure the recommendation service is running.');
                setLoading(false);
            });
        }
    };

    // Get button text based on state
    const getButtonText = () => {
        if (loading) return 'Finding Perfect Matches...';
        if (deepLoading) return deepMessage || 'Researching...';
        if (isDeepResearch) return 'Deep Web Research';
        return 'Get Recommendations';
    };

    return (
        <section style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            padding: '100px 20px 60px',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Container fluid style={{ maxWidth: '1400px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '80px',
                    flexWrap: 'wrap'
                }}>
                    {/* Left Side - Title and Description */}
                    <div style={{ flex: '1', minWidth: '350px' }}>
                        <h1 style={{
                            fontSize: '72px',
                            fontWeight: '400',
                            color: '#1a1a1a',
                            marginBottom: '40px',
                            letterSpacing: '-2px',
                            lineHeight: '1.1',
                            fontFamily: "'Bitter', serif"
                        }}>
                            Discover Your<br />Signature Scent
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: '#4a4a4a',
                            lineHeight: '1.7',
                            margin: 0
                        }}>
                            {isDeepResearch
                                ? 'AI-powered web research finds perfumes from across the internet based on your preferences'
                                : 'Select your favorite fragrance notes and let AI find the perfect perfume match from our collection of 65,000+ fragrances'
                            }
                        </p>
                    </div>

                    {/* Right Side - Notes Grid and Button */}
                    <div style={{ flex: '1', minWidth: '500px' }}>
                        {/* Notes Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            {notesOptions.map((note) => {
                                const selected = isNoteSelected(note.value);
                                return (
                                    <div
                                        key={note.value}
                                        onClick={() => toggleNote(note)}
                                        style={{
                                            backgroundColor: note.color,
                                            padding: '40px 20px',
                                            borderRadius: '24px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            border: selected ? '3px solid #3d4f5c' : '3px solid transparent',
                                            transition: 'all 0.3s ease',
                                            boxShadow: selected ? '0 4px 16px rgba(61, 79, 92, 0.3)' : 'none',
                                            transform: selected ? 'scale(1.05)' : 'scale(1)',
                                            userSelect: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '120px',
                                            aspectRatio: '1'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!selected) {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!selected) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '32px',
                                            marginBottom: '8px'
                                        }}>
                                            {note.emoji}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#2c3e50'
                                        }}>
                                            {note.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Deep Research Toggle */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 24px',
                            backgroundColor: isDeepResearch ? '#e8f5e9' : '#f5f5f5',
                            borderRadius: '16px',
                            marginBottom: '16px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div>
                                <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                                    Deep Web Research
                                </span>
                                <p style={{
                                    margin: '4px 0 0',
                                    fontSize: '12px',
                                    color: '#7f8c8d'
                                }}>
                                    {isDeepResearch
                                        ? 'AI searches the web for recommendations (30s-2min)'
                                        : 'Quick search from our database'}
                                </p>
                            </div>
                            <div
                                onClick={() => !isAnyLoading && setIsDeepResearch(!isDeepResearch)}
                                style={{
                                    width: '50px',
                                    height: '28px',
                                    backgroundColor: isDeepResearch ? '#4caf50' : '#ccc',
                                    borderRadius: '28px',
                                    position: 'relative',
                                    cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    opacity: isAnyLoading ? 0.6 : 1
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    top: '4px',
                                    left: isDeepResearch ? '26px' : '4px',
                                    transition: 'left 0.3s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                        </div>

                        {/* Additional preferences input (shown when deep research enabled) */}
                        {isDeepResearch && (
                            <input
                                type="text"
                                placeholder="Optional: Add preferences (e.g., 'summer scent under $100')"
                                value={additionalPreferences}
                                onChange={(e) => setAdditionalPreferences(e.target.value)}
                                disabled={deepLoading}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    fontSize: '14px',
                                    marginBottom: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#4caf50'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        )}

                        {/* Progress indicator (shown during deep research) */}
                        {deepLoading && (
                            <div style={{
                                marginBottom: '16px',
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ fontWeight: '500', color: '#2c3e50', fontSize: '14px' }}>
                                        {deepMessage || 'Starting research...'}
                                    </span>
                                    <span style={{ color: '#7f8c8d', fontSize: '14px' }}>{deepProgress}%</span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${deepProgress}%`,
                                        height: '100%',
                                        backgroundColor: '#4caf50',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                                <button
                                    onClick={cancelResearch}
                                    style={{
                                        marginTop: '12px',
                                        padding: '8px 16px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #e74c3c',
                                        color: '#e74c3c',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#e74c3c';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#e74c3c';
                                    }}
                                >
                                    Cancel Research
                                </button>
                            </div>
                        )}

                        {/* Error message */}
                        {deepError && (
                            <div style={{
                                marginBottom: '16px',
                                padding: '16px 20px',
                                backgroundColor: '#ffebee',
                                borderRadius: '12px',
                                color: '#c62828',
                                fontSize: '14px'
                            }}>
                                Error: {deepError}
                            </div>
                        )}

                        {/* Get Recommendations Button */}
                        <Button
                            onClick={getRecommendations}
                            disabled={isAnyLoading || selectedNotes.length === 0}
                            style={{
                                width: '100%',
                                padding: '20px 80px',
                                fontSize: '16px',
                                fontWeight: '500',
                                backgroundColor: selectedNotes.length === 0 ? '#95a5a6' : (isDeepResearch ? '#4caf50' : '#3d4f5c'),
                                border: 'none',
                                borderRadius: '50px',
                                transition: 'all 0.3s ease',
                                transform: isAnyLoading ? 'scale(0.98)' : 'scale(1)',
                                boxShadow: selectedNotes.length > 0 ? '0 4px 20px rgba(61, 79, 92, 0.3)' : 'none',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedNotes.length > 0 && !isAnyLoading) {
                                    e.target.style.backgroundColor = isDeepResearch ? '#388e3c' : '#2c3d47';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 24px rgba(61, 79, 92, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedNotes.length > 0) {
                                    e.target.style.backgroundColor = isDeepResearch ? '#4caf50' : '#3d4f5c';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 20px rgba(61, 79, 92, 0.3)';
                                }
                            }}
                        >
                            {getButtonText()}
                        </Button>
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div style={{ marginTop: '120px', maxWidth: '900px', margin: '120px auto 0' }}>
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#2c3e50',
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                            Your Perfect Matches
                        </h2>

                        {recommendations.map((rec, index) => (
                            <Card
                                key={index}
                                onClick={() => handleSaveFragrance(rec)}
                                style={{
                                    border: 'none',
                                    borderRadius: '16px',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                                }}
                            >
                                <Card.Body style={{ padding: '30px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontSize: '22px',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                margin: 0,
                                                marginBottom: '8px'
                                            }}>
                                                {rec.Name}
                                            </h3>
                                            <p style={{
                                                fontSize: '16px',
                                                color: '#7f8c8d',
                                                margin: 0,
                                                fontWeight: '500'
                                            }}>
                                                {rec.Brand}
                                            </p>
                                        </div>
                                        <div style={{
                                            backgroundColor: '#ecf0f1',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            color: '#2c3e50',
                                            fontWeight: '600'
                                        }}>
                                            #{index + 1}
                                        </div>
                                    </div>

                                    <div style={{
                                        marginTop: '16px',
                                        padding: '16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px'
                                    }}>
                                        <p style={{
                                            fontSize: '13px',
                                            color: '#95a5a6',
                                            margin: 0,
                                            marginBottom: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            fontWeight: '600'
                                        }}>
                                            Fragrance Notes
                                        </p>
                                        <p style={{
                                            fontSize: '15px',
                                            color: '#2c3e50',
                                            margin: 0,
                                            lineHeight: '1.6'
                                        }}>
                                            {rec.Notes}
                                        </p>
                                    </div>

                                    {/* Show reasoning for deep research results */}
                                    {rec.reasoning && (
                                        <div style={{
                                            marginTop: '12px',
                                            padding: '12px 16px',
                                            backgroundColor: '#e8f5e9',
                                            borderRadius: '12px'
                                        }}>
                                            <p style={{
                                                fontSize: '13px',
                                                color: '#2e7d32',
                                                margin: 0,
                                                lineHeight: '1.5',
                                                fontStyle: 'italic'
                                            }}>
                                                {rec.reasoning}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{
                                        marginTop: '16px',
                                        fontSize: '14px',
                                        color: '#95a5a6',
                                        textAlign: 'center',
                                        fontStyle: 'italic'
                                    }}>
                                        Click to save to your favorites
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}

export default RecSystem;
