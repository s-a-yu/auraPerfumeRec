import Carousel from 'react-bootstrap/Carousel';
import Nav from "react-bootstrap/Nav";

var heroData = [
  {
    id: 1,
    image: '/src/assets/images/branch.jpg',
    title: 'Your Scent Story Starts Here',
    description: 'find your scent, find your aura',
    link: 'http://localhost:3000/#scent-quiz'
  },
  {
    id: 2,
    image: '/src/assets/images/carousel2.jpg',
    title: 'Crafted with precision and passion',
    description: 'Our fragrances captures the essence of nature, blending aromatic notes to create a unique and unforgettable scent.',
    link: 'http://localhost:3000/#about'
  },
  {
    id: 3,
    image: '/src/assets/images/carousel3.jpg',
    title: 'Discover Your Signature Scent',
    description: 'Aura takes the guesswork out of fragrance shopping by curating scents tailored to you, through our personalized quiz and evolving recommendations.',
    link: 'http://localhost:3000/#explore'
  }
]

function AppHero() {
  return (
    <section id="home" className="hero-block">
       <Carousel>
          {
            heroData.map(hero => {
              return (
                <Carousel.Item key={hero.id}>
                  <img
                    className="d-block w-100"
                    src={hero.image}
                    alt={"slide " + hero.id}
                    style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                  />
                  <Carousel.Caption>
                    <h2>{hero.title}</h2>
                    <p>{hero.description}</p>
                    <a className="btn btn-primary" href={hero.link}>Learn More <i className="fas fa-chevron-right"></i></a>
                  </Carousel.Caption>             
                </Carousel.Item>
              );
            })
          }
      </Carousel>
    </section>
  );
}

export default AppHero;