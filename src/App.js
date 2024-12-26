import React from 'react';
import EditableMap from './components/EditableMap';
import './tailwind.css';

const App = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4'>
      <h1 className="text-2xl font-bold mb-4">Hakim Savcı Atama Simülatörü</h1>
      <div className="w-full max-w-[1200px]">
        <EditableMap />
      </div>
    </div>
  );
};

export default App; 