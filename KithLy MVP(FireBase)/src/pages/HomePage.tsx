import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Welcome to Kithly</h1>
      {/* Hero section */}
      <div className="hero-section text-center my-8">
        <img src="/placeholder-hero.jpg" alt="Family connecting" className="mx-auto" />
        <h2 className="text-2xl font-semibold my-4">Connecting families, one gift at a time</h2>
        <p className="text-lg">Send gifts to your loved ones in Zambia, no matter where you are in the world.</p>
      </div>
    </div>
  );
};

export default HomePage;
