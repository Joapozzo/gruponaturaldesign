"use client";
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categorias from './components/Categorias';
import ProductosDestacados from './components/ProductosDestacados';
import Nosotros from './components/Nosotros';
import Testimonios from './components/Testimonios';
import Faq from './components/Faq';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import InstagramCTA from './components/InstagramCTA';

const NTDS_Website = () => {

  return (
    <div className="min-h-screen bg-white">
      
      {/* CSS Variables */}
      <style jsx global>{`
        :root {
          --red: #Ed3237;
          --red-dark: #A80006;
          --black: #000000;
          --white: #FFFFFF;
          --gray-light: #BDBFC1;
          --gray-medium: #666666;
          --gray-bg: #F5F5F5;
        }
      `}</style>

      <Navbar />
      <Hero />
      <Categorias/>
      <ProductosDestacados/>
      <InstagramCTA/>
      <Nosotros/>
      <Testimonios/>
      <Faq/>
      <Contacto/>
      <Footer/> 
    </div>
  );
};

export default NTDS_Website;