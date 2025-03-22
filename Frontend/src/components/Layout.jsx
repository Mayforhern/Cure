import React from "react";
import Hero from './Hero';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;