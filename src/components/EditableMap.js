import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as TurkeyMap } from '../static/turkey_fixed.svg';
import Modal from './Modal';

const EditableMap = () => {
  const [regionColors, setRegionColors] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPathsReady, setIsPathsReady] = useState(false);
  const originalPaths = useRef(null);

  useEffect(() => {
    // Wait for next tick to ensure SVG is rendered
    setTimeout(() => {
      originalPaths.current = Array.from(document.querySelectorAll('path')).map(path => ({
        id: path.id,
        d: path.getAttribute('d'),
        title: path.getAttribute('title') || `City ${path.id}`
      }));
      setIsPathsReady(true);
    }, 0);
  }, []);

  const handleClick = (id, title) => {
    console.log(`Clicked on: ${title}`);
    setSelectedCity(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
    setRegionColors({}); // Reset all colors
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color;
    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (color === '#FFFFFF' || color === '#F0F0F0');
    return color;
  };

  const selectRandomCity = () => {
    if (!isPathsReady || !originalPaths.current) {
      console.error("Paths are not ready yet.");
      return;
    }

    const paths = originalPaths.current;
    if (paths.length === 0) {
      console.error("No paths found in the SVG.");
      return;
    }

    setRegionColors({});

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 10) {
        clearInterval(interval);
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        const selectedCityId = randomPath.id;
        const cityTitle = randomPath.title;

        handleClick(selectedCityId, cityTitle);
        setRegionColors((prevColors) => ({
          ...prevColors,
          [selectedCityId]: getRandomColor(),
        }));
        return;
      }

      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      const newColor = getRandomColor();
      setRegionColors((prevColors) => ({
        ...prevColors,
        [randomPath.id]: newColor,
      }));

      setTimeout(() => {
        setRegionColors((prevColors) => ({
          ...prevColors,
          [randomPath.id]: '#f0f0f0',
        }));
      }, 300);

      count++;
    }, 500);
  };

  return (
    <>
      <button onClick={selectRandomCity} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Select Random City
      </button>
      <svg
        width="1200"
        height="600"
        viewBox="0 0 792.5976 334.55841"
        xmlns="http://www.w3.org/2000/svg"
      >
        <TurkeyMap onClick={(e) => {
          const target = e.target;
          if (target.tagName === 'path') {
            const title = target.getAttribute('title') || 'Unknown City';
            handleClick(target.id, title);
          }
        }} />
        {originalPaths.current?.map((path) => (
          <path
            key={`dynamic-${path.id}-${Date.now()}`}
            className="dynamic-path"
            fill={regionColors[path.id] || '#f0f0f0'}
            id={path.id}
            d={path.d}
            title={path.title}
          />
        ))}
      </svg>
      {isModalOpen && <Modal title={selectedCity} onClose={closeModal} />}
    </>
  );
};

export default EditableMap;
