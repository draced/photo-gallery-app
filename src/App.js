import React, { useState, useEffect, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { photos } from "./photos";
import { getAllPhotos } from './services/PhotoService';

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [statePhotos, setStatePhotos] = useState([]);

  useEffect(() => {
    const response = getAllPhotos();
    response.then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log(data);
          let photos = data.photoset.photo.map(item => {
            let aspectRatio = parseFloat(item.width_o / item.height_o);
            return {
              src: item.url_l,
              width: parseInt(item.width_o),
              height: parseInt(item.height_o),
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
          setStatePhotos(photos);
        })
      }
    })
    console.log('statePhotos: ' + JSON.stringify(statePhotos));
  },[]);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <div>
      <Gallery photos={statePhotos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={statePhotos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}

export default App;
