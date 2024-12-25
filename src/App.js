import React from 'react';
import EditableMap from './components/EditableMap';
import './tailwind.css';

const App = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white'>
      <h1>Editable Map</h1>
      <EditableMap />
    </div>
  );
};

export default App; 