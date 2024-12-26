import React from 'react';

const Modal = ({ title, onClose, selectedCity }) => {
  if (!selectedCity) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Tebrikler! 🎉</h1>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-black">Atandığınız Adliye:</h3>
          <ul className="space-y-2">
            {selectedCity.courthouses.map((courthouse, index) => {
              const [name, city] = courthouse.split(' / ');
              return (
                <li 
                  key={index}
                  className="p-4 bg-gray-50 rounded text-black hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-600">{city}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;