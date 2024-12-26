import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as TurkeyMap } from '../static/turkey_fixed.svg';
import Modal from './Modal';
import cityData from '../static/CityData';

const cityDuplicates = {
  'TR-01': ['TR-01-1', 'TR-01-2', 'TR-01-3'],
  'TR-03': ['TR-03-1', 'TR-03-2'],
  'TR-04': ['TR-04-1', 'TR-04-2'],
  'TR-06': ['TR-06-1', 'TR-06-2', 'TR-06-3', 'TR-06-4'],
  'TR-07': ['TR-07-1', 'TR-07-2', 'TR-07-3', 'TR-07-4'],
  'TR-09': ['TR-09-1', 'TR-09-2'],
  'TR-10': ['TR-10-1', 'TR-10-2'],
  'TR-13': ['TR-13-1'],
  'TR-16': ['TR-16-1'],
  'TR-19': ['TR-19-1'],
  'TR-20': ['TR-20-1'],
  'TR-21': ['TR-21-1', 'TR-21-2'],
  'TR-23': ['TR-23-1'],
  'TR-25': ['TR-25-1'],
  'TR-27': ['TR-27-1', 'TR-27-2'],
  'TR-28': ['TR-28-1'],
  'TR-30': ['TR-30-1'],
  'TR-31': ['TR-31-1', 'TR-31-2', 'TR-31-3', 'TR-31-4', 'TR-31-5', 'TR-31-6', 'TR-31-7'],
  'TR-34': ['TR-34-1', 'TR-34-2', 'TR-34-3', 'TR-34-4', 'TR-34-5', 'TR-34-6'],
  'TR-35': ['TR-35-1', 'TR-35-2', 'TR-35-3', 'TR-35-4'],
  'TR-37': ['TR-37-1'],
  'TR-38': ['TR-38-1'],
  'TR-42': ['TR-42-1', 'TR-42-2', 'TR-42-3', 'TR-42-4'],
  'TR-43': ['TR-43-1'],
  'TR-45': ['TR-45-1', 'TR-45-2', 'TR-45-3', 'TR-45-4', 'TR-45-5'],
  'TR-46': ['TR-46-1'],
  'TR-47': ['TR-47-1', 'TR-47-2'],
  'TR-48': ['TR-48-1', 'TR-48-2', 'TR-48-3', 'TR-48-4'],
  'TR-52': ['TR-52-1', 'TR-52-2'],
  'TR-55': ['TR-55-1', 'TR-55-2', 'TR-55-3', 'TR-55-4'],
  'TR-59': ['TR-59-1', 'TR-59-2'],
  'TR-60': ['TR-60-1'],
  'TR-61': ['TR-61-1'],
  'TR-63': ['TR-63-1', 'TR-63-2'],
  'TR-65': ['TR-65-1'],
  'TR-66': ['TR-66-1']
};

const processCourthouseData = (cityData) => {
  const courthouseUpdates = {};

  Object.entries(cityData).forEach(([id, name]) => {
    if (id.includes('-')) {
      // This is a sub-courthouse (e.g., TR-06-1)
      const parentId = id.split('-').slice(0, 2).join('-'); // Gets TR-06 from TR-06-1
      
      courthouseUpdates[id] = {
        inherit: parentId,
        courthouse: name
      };
    } else {
      // This is a main courthouse (e.g., TR-06)
      courthouseUpdates[id] = {
        courthouse: name
      };
    }
  });

  return courthouseUpdates;
};

const updateSvgWithCourthouses = (paths, courthouseData) => {
  paths.forEach(path => {
    const id = path.id;
    
    // If we have direct courthouse data for this ID
    if (courthouseData[id]) {
      if (courthouseData[id].inherit) {
        // Copy all properties from parent except title and id
        const parentPath = paths.find(p => p.id === courthouseData[id].inherit);
        if (parentPath) {
          Object.keys(parentPath).forEach(key => {
            if (key !== 'id' && key !== 'title') {
              path[key] = parentPath[key];
            }
          });
        }
      }
      // Add/update courthouse information
      path.courthouse = courthouseData[id].courthouse;
    }
  });
};

const EditableMap = () => {
  const [regionColors, setRegionColors] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPathsReady, setIsPathsReady] = useState(false);
  const originalPaths = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const paths = Array.from(mapRef.current.querySelectorAll('path'));
      originalPaths.current = paths.map(path => ({
        id: path.id,
        title: path.getAttribute('title'),
        d: path.getAttribute('d'),
        // other existing properties...
      }));

      const courthouseUpdates = processCourthouseData(cityData);
      updateSvgWithCourthouses(originalPaths.current, courthouseUpdates);
      setIsPathsReady(true);
    }
  }, []);

  const handleClick = (id, title, selectedCourthouseId = null) => {
    console.log(`Clicked on: ${title}`);
    const selectedPath = originalPaths.current.find(path => path.id === id);
    let courthouses = [selectedPath.courthouse];
    
    // Add sub-courthouses if they exist
    if (cityDuplicates[id]) {
      cityDuplicates[id].forEach(subId => {
        if (cityData[subId]) {
          courthouses.push(cityData[subId]);
        }
      });
    }

    // If a specific courthouse was selected, filter to show only that one
    if (selectedCourthouseId) {
      courthouses = [cityData[selectedCourthouseId]];
    }

    setSelectedCity({ title, courthouses });
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

  const selectRandomCourthouse = () => {
    if (!isPathsReady || !originalPaths.current) {
      console.error("Paths are not ready yet.");
      return;
    }

    setRegionColors({});

    // Create array of all possible courthouses
    const allCourthouses = [];
    Object.entries(cityData).forEach(([id, name]) => {
      allCourthouses.push({
        id,
        name,
        parentId: id.includes('-') ? id.split('-').slice(0, 2).join('-') : id
      });
    });

    let count = 0;
    const interval = setInterval(() => {
      if (count >= 20) {
        clearInterval(interval);
        // Select random courthouse
        const randomCourthouse = allCourthouses[Math.floor(Math.random() * allCourthouses.length)];
        const parentPath = originalPaths.current.find(path => path.id === randomCourthouse.parentId);
        
        if (parentPath) {
          handleClick(randomCourthouse.parentId, parentPath.title, randomCourthouse.id);
          setRegionColors((prevColors) => ({
            ...prevColors,
            [randomCourthouse.parentId]: getRandomColor(),
          }));
        }
        return;
      }

      // Animation logic with faster timing
      const randomPath = originalPaths.current[Math.floor(Math.random() * originalPaths.current.length)];
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
      }, 200);

      count++;
    }, 300);
  };

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center">
      <button onClick={selectRandomCourthouse} className="mb-20 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Çalıştır
      </button>
      <svg
        className="w-full h-auto"
        viewBox="0 0 792.5976 334.55841"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        ref={mapRef}
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
      {isModalOpen && <Modal 
        title={selectedCity?.title}
        onClose={closeModal}
        selectedCity={selectedCity}
      />}
    </div>
  );
};

export default EditableMap;
