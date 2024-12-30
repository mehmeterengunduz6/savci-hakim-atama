import React, { useEffect, useState } from 'react';

const AdBanner = () => {
  const [isAdVisible, setIsAdVisible] = useState(false);

  useEffect(() => {
    // Simulate a delay or condition for when the ad should become visible
    const timer = setTimeout(() => {
      setIsAdVisible(true);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAdVisible && window.adsbygoogle) {
      requestAnimationFrame(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error("Error pushing ad:", error);
          }
      })
    }
  }, [isAdVisible]);

  return (
    <div className="ad-banner">
      {isAdVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-1805020580499630"
          data-ad-slot="8573248331"
        />
      )}
    </div>
  );
};

export default AdBanner;