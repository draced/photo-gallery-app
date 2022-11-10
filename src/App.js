import React, { useState, useEffect, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { fetchPhotos } from './services/FlickrService';

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    loadPhotos();
    return () => abortController.abort();
  },[]);

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
          setPhotos(photos);
        });
  }

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
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
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
