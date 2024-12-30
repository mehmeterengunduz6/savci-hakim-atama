import React from 'react';
import EditableMap from './components/EditableMap';
import AdBanner from './components/AdBanner';
import './tailwind.css';

const App = React.memo(() => {
  console.log("App component rendered");
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4'>
      <h1 className="text-2xl font-bold mb-4">Hakim Savcı Atama Simülatörü</h1>
      <div className="w-full max-w-[1200px]">
        <EditableMap />
      </div>
      <AdBanner />
    </div>
  );
});

export default App; 