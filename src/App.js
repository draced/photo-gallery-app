import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchPhotos } from './services/FlickrService';
import { getXmasCards } from "./data/XmasCards";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PhotoViewer } from "./components/PhotoViewer";

function App() {
  const [flickrPhotos, setFlickrPhotos] = useState([]);
  const [xmasCards, setXmasCards] = useState([]);
  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    fetchPhotos()
      .then(response => response.json())
      .then(data => {
        const aspectRatio = (height, width) => {
          if (height > width) {
            return { width: 1, height: height / width }
          } else {
            return { height: 1, width: width / height }
          }
        }
        let photos = data.photoset.photo.map(item => {
          let aspect = aspectRatio(item.height_m, item.width_m);
          return {
            src: item.url_l,
            width: aspect.width,
            height: aspect.height,
            title: item.title,
            alt: item.title,
            key: item.id,
            srcSet: [
              `${item.url_m} ${item.width_m}w`,
              `${item.url_c} ${item.width_c}w`,
              `${item.url_l} ${item.width_l}w`,
              `${item.url_h} ${item.width_h}w`,
            ],
            sizes: '(min-width: 480px) 50vw, (min-width: 1024px) 33.3vw, 100vw',
          };
        });
        
        setFlickrPhotos(photos);
        const xmasCards = getXmasCards();
        setXmasCards(xmasCards);
      });
  }

  return (
    <div>
      <h1 class="greetings" style={centerStyle}>Happy Holidays from the Darnolds!</h1>
      <div style={centerStyle}>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/E2vKgKif88o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>2022 Gallery</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PhotoViewer photos={flickrPhotos}></PhotoViewer>
          </AccordionDetails>
        </Accordion>
        {xmasCards.map((card) => {
          return (
            <>
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>{card.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PhotoViewer photos={card.cards}></PhotoViewer>
            </AccordionDetails>
          </Accordion>
          </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
