import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Pagination from 'react-bootstrap/Pagination';

const worksData = [
  {
    id: 1,
    link: 'https://www.byredo.com/us_en/gypsy-water-eau-de-parfum-50ml',
    image: '/src/assets/images/perfume1.jpg',
    title: 'Gypsy Water',
    subtitle: 'Byredo'
  },
  {
    id: 2,
    link: 'https://www.valentino-beauty.us/fragrances/fragrances-men/born-in-roma-uomo-intense/born-in-roma-uomo-eau-de-parfum-intense-MPL01907.html',
    image: '/src/assets/images/perfume2.jpg',
    title: 'Born in Roma Intense',
    subtitle: 'Valentino'
  },
  {
    id: 3,
    link: 'https://www.sephora.com/product/crystal-noir-P307000?icid2=products%20grid:p307000:product',
    image: '/src/assets/images/perfume3.jpg',
    title: 'Crystal Noir',
    subtitle: 'Versace'
  },
  {
    id: 4,
    link: 'https://phlur.com/products/vanilla-skin-body-mist?srsltid=AfmBOooyXJQsuAzehexkqvZXcIUWv-wAHbiHRiI-pJyqzqjg-qpuOAmI',
    image: '/src/assets/images/perfume4.jpg',
    title: 'Vanilla Skin',
    subtitle: 'Phlur'
  },
  {
    id: 5,
    link: 'https://www.chanel.com/us/fragrance/p/107360/bleu-de-chanel-eau-de-parfum-spray/',
    image: '/src/assets/images/perfume5.jpg',
    title: 'Bleu',
    subtitle: 'Chanel'
  },
  {
    id: 6,
    link: 'https://www.giorgioarmanibeauty-usa.com/fragrances/womens-perfume/acqua-di-gioia/acqua-di-gioia-eau-de-parfum/A378.html?srsltid=AfmBOorgqU0CJKF4yosT4jjIh_JivOqS-NU2tO4GQ3Zg9RBF1MWascd_',
    image: '/src/assets/images/perfume6.jpg',
    title: 'Acqua Di Gioia',
    subtitle: 'Giorgio Armani'
  },
  {
    id: 7,
    link: 'https://www.valentino-beauty.us/fragrances/fragrances-women/fragrances-women-born-in-roma/donna-born-in-roma-eau-de-parfum-MPL00468.html',
    image: '/src/assets/images/perfume7.jpg',
    title: 'Born in Roma Donna',
    subtitle: 'Valentino'
  },
  {
    id: 8,
    link: 'https://us.parfums-de-marly.com/products/delina',
    image: '/src/assets/images/perfume8.jpg',
    title: 'Delina',
    subtitle: 'Parfums de Marly Paris'
  },
  {
    id: 9,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  },
  {
    id: 10,
    link: 'https://www.sephora.com/product/eros-P382751?icid2=products%20grid:p382751:product',
    image: '/src/assets/images/perfume10.jpg',
    title: 'Eros',
    subtitle: 'Versace'
  },
  {
    id: 11,
    link: 'https://www.sephora.com/product/sauvage-P400057?skuId=1739317&icid2=products%20grid:p400057:product',
    image: '/src/assets/images/perfume11.jpg',
    title: 'Sauvage',
    subtitle: 'Dior'
  },
  {
    id: 12,
    link: 'https://www.sephora.com/product/1-million-P269120?skuId=1200773&icid2=products%20grid:p269120:product',
    image: '/src/assets/images/perfume12.jpg',
    title: '1 Million',
    subtitle: 'Rabanne'
  },
  {
    id: 13,
    link: 'https://www.sephora.com/product/jean-paul-gaultier-le-male-le-parfum-P510777?skuId=2775930&icid2=products%20grid:p510777:product',
    image: '/src/assets/images/perfume13.jpg',
    title: 'Le Male',
    subtitle: 'Jean Paul Gaultier'
  },
  {
    id: 14,
    link: 'https://www.sephora.com/product/light-blue-pour-homme-P186402?skuId=1019991&icid2=products%20grid:p186402:product',
    image: '/src/assets/images/perfume14.jpg',
    title: 'Light Blue',
    subtitle: 'Dolce & Gabbana'
  },
  {
    id: 15,
    link: 'https://www.sephora.com/product/spicebomb-extreme-P405501?skuId=1798479&icid2=products%20grid:p405501:product',
    image: '/src/assets/images/perfume15.jpg',
    title: 'Spicebomb Extreme',
    subtitle: 'Viktor & Rolf'
  },
  {
    id: 16,
    link: 'https://www.sephora.com/product/hero-edp-P501489?skuId=2603363&icid2=products%20grid:p501489:product',
    image: '/src/assets/images/perfume16.jpg',
    title: 'Hero',
    subtitle: 'Burberry'
  },
  {
    id: 17,
    link: 'https://www.sephora.com/product/tobacco-vanille-P393151?skuId=1449289&icid2=products%20grid:p393151:product',
    image: '/src/assets/images/perfume17.jpg',
    title: 'Tobacco Vanille',
    subtitle: 'Tom Ford'
  },
  {
    id: 18,
    link: 'https://www.sephora.com/product/paco-rabanne-invictus-parfum-P510922?skuId=2758183&icid2=products%20grid:p510922:product',
    image: '/src/assets/images/perfume18.jpg',
    title: 'Invictus',
    subtitle: 'Rabanne'
  }
];

const itemsPerPage = 9; // Number of items per page (3x3 grid)

function AppExplore() {
  const [activePage, setActivePage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(worksData.length / itemsPerPage);

  // Get the items for the current page
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = worksData.slice(indexOfFirstItem, indexOfLastItem);

  // Create pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => setActivePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <section id="explore" className="block works-block">
      <Container fluid>
        <div className="title-holder">
          <h2>Explore</h2>
          <div className="subtitle"> find your perfect fragrance</div>
        </div>
        <Row className="portfoliolist">
          {currentItems.map((works) => (
            <Col sm={4} key={works.id}>
              <div className="portfolio-wrapper">
                <a href={works.link}>
                  <div style={{ width: '400px', height: '220px', overflow: 'hidden' }}>
                    <Image
                      src={works.image}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt={works.title}
                    />
                  </div>
                  <div className="label text-center">
                    <h3>{works.title}</h3>
                    <p>{works.subtitle}</p>
                  </div>
                </a>
              </div>
            </Col>
          ))}
        </Row>
        <Pagination>{paginationItems}</Pagination>
      </Container>
    </section>
  );
}

export default AppExplore;

/*
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Pagination from 'react-bootstrap/Pagination';

const worksData = [
  {
    id: 1,
    link: 'https://www.byredo.com/us_en/gypsy-water-eau-de-parfum-50ml',
    image: '/src/assets/images/perfume1.jpg',
    title: 'Gypsy Water',
    subtitle: 'Byredo'
  },
  {
    id: 2,
    link: 'https://www.valentino-beauty.us/fragrances/fragrances-men/born-in-roma-uomo-intense/born-in-roma-uomo-eau-de-parfum-intense-MPL01907.html',
    image: '/src/assets/images/perfume2.jpg',
    title: 'Born in Roma Intense',
    subtitle: 'Valentino'
  },
  {
    id: 3,
    link: 'https://www.google.com',
    image: '/src/assets/images/perfume3.jpg',
    title: 'Forte pour Femme',
    subtitle: 'Unknown'
  },
  {
    id: 4,
    link: 'https://phlur.com/products/vanilla-skin-body-mist?srsltid=AfmBOooyXJQsuAzehexkqvZXcIUWv-wAHbiHRiI-pJyqzqjg-qpuOAmI',
    image: '/src/assets/images/perfume4.jpg',
    title: 'Vanilla Skin',
    subtitle: 'Phlur'
  },
  {
    id: 5,
    link: 'https://www.chanel.com/us/fragrance/p/107360/bleu-de-chanel-eau-de-parfum-spray/',
    image: '/src/assets/images/perfume5.jpg',
    title: 'Bleu',
    subtitle: 'Chanel'
  },
  {
    id: 6,
    link: 'https://www.giorgioarmanibeauty-usa.com/fragrances/womens-perfume/acqua-di-gioia/acqua-di-gioia-eau-de-parfum/A378.html?srsltid=AfmBOorgqU0CJKF4yosT4jjIh_JivOqS-NU2tO4GQ3Zg9RBF1MWascd_',
    image: '/src/assets/images/perfume6.jpg',
    title: 'Acqua Di Gioia',
    subtitle: 'Giorgio Armani'
  },
  {
    id: 7,
    link: 'https://www.valentino-beauty.us/fragrances/fragrances-women/fragrances-women-born-in-roma/donna-born-in-roma-eau-de-parfum-MPL00468.html',
    image: '/src/assets/images/perfume7.jpg',
    title: 'Born in Roma Donna',
    subtitle: 'Valentino'
  },
  {
    id: 8,
    link: 'https://us.parfums-de-marly.com/products/delina',
    image: '/src/assets/images/perfume8.jpg',
    title: 'Delina',
    subtitle: 'Parfums de Marly Paris'
  },
  {
    id: 9,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 10,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 11,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 12,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 13,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 14,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 15,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 16,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 17,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
  {
    id: 18,
    link: 'https://www.chanel.com/us/fragrance/p/126550/chance-eau-vive-eau-de-toilette-spray/',
    image: '/src/assets/images/perfume9.jpg',
    title: 'Chance',
    subtitle: 'Chanel'
  }
]

let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

function AppExplore() {
  return (
    <section id="works" className="block works-block">
      <Container fluid>
        <div className="title-holder">
          <h2>Explore</h2>
          <div className="subtitle"> find your perfect fragrance</div>
        </div>
        <Row className='portfoliolist'>
          {
            worksData.map(works => {
              return (
                <Col sm={4} key={works.id}>
                  <div className='portfolio-wrapper'>
                    <a href={works.link}>
                    <div style={{ width: '400px', height: '150px', overflow: 'hidden' }}>
                      <Image
                        src={works.image}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={works.title}
                      />
                    </div>
                      <div className='label text-center'>
                        <h3>{works.title}</h3>
                        <p>{works.subtitle}</p>
                      </div>
                    </a>
                  </div>
                </Col>
              );
            })
          }
        </Row>
        <Pagination>{items}</Pagination>
      </Container>  
    </section>
  );
}

export default AppExplore;
*/