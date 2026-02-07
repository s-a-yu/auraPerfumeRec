import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const teamsData = [
  {
    id: 1,
    image: require('../assets/images/erikaLee.png'),
    fbLink: 'https://www.facebook.com',
    linkedinLink: 'https://www.linkedin.com/in/lee-eerika/',
    name: 'Erika Lee',
    description: 'Class of 2026'
  },
  {
    id: 2,
    image: require('../assets/images/kory.jpg'),
    linkedinLink: 'https://www.linkedin.com/in/karfania/',
    name: 'Kory Arfania',
    description: 'Class of 2025'
  },
  {
    id: 3,
    image: require('../assets/images/jaedonProfile.png'),
    linkedinLink: 'https://www.linkedin.com/in/jaedonw/',
    name: 'Jaedon Wong',
    description: 'Class of 2025'
  },
  {
    id: 4,
    image: require('../assets/images/sumeet.png'),
    linkedinLink: 'https://www.linkedin.com/in/sumeet-kapoorsk/',
    name: 'Sumeet Kapoor',
    description: 'Class of 2026'
  },
  {
    id: 5,
    image: '/src/assets/images/stephanie.jpeg',
    linkedinLink: 'https://www.linkedin.com/in/s-a-yu/',
    name: 'Stephanie Yu',
    description: 'Class of 2025'
  },
  {
    id: 6,
    image: require('../assets/images/taylor.jpg'),
    linkedinLink: 'https://www.linkedin.com/in/taylor-hill-miles/',
    name: 'Taylor Hill-Miles',
    description: 'Class of 2025'
  }
]

function AppTeams() {
  return (
    <section id="teams" className="block teams-block">
      <Container fluid>
        <div className="title-holder">
          <h2>Our Team </h2>
          <div className="subtitle">some of our experts</div>
        </div>
        <Row>
          {
            teamsData.map(teams => {
              return (
                <Col sm={6} md={4} key={teams.id} className="d-flex flex-column align-items-center">
                  <div className='image'>
                    <div style={{ width: '210px', height: '250px', overflow: 'hidden' }}>
                      <Image
                        src={teams.image}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className='overlay' style={{ width: '210px', height: '250px', overflow: 'hidden' }}>
                      <div className='socials'>
                        <ul>
                          <li><a href={teams.linkedinLink}><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='content'>
                    <h3>{teams.name}</h3>
                    <span className='designation'>{teams.designation}</span>
                    <p>{teams.description}</p>
                  </div>
                </Col>
              );
            })
          }
        </Row>
      </Container>
    </section>
  );
}

export default AppTeams;