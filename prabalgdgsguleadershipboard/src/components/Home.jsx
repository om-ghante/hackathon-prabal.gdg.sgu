import React from 'react';
import { motion } from 'framer-motion';
import Backgroundimg from '../assets/Background.jpg';
import Prismas from '../assets/Prismas.svg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/app');
  }
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-black opacity-50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
      >
      </motion.div>
      
      <div className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Backgroundimg})` }}>
      </div>
      
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4">
        <motion.div 
          className="text-white text-center flex flex-col itme-center justify-center font-bold tracking-wider text-lg sm:text-xl"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          PRABAL
          <div className="text-xs tracking-wider opacity-70">Hack It, Till You Make It</div>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </motion.div>
      </header>
      
      <main className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 mt-[-50px] sm:mt-[-60px] md:mt-[-50px]">
        <div className="text-center">
          <motion.h1 
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest" 
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              letterSpacing: "0.05em",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            PRABAL
          </motion.h1>
          
          <motion.h2 
            className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-widest mt-1 mb-4 sm:mb-6 md:mb-8" 
            style={{ letterSpacing: "0.25em" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Hack It Till You make it™
          </motion.h2>
          
          <motion.p 
            className="text-white text-base sm:text-lg tracking-wider mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            A National Level Hackthon
          </motion.p>
          
          <motion.button 
            className="border border-yellow-500 text-yellow-500 px-8 sm:px-10 md:px-12 py-2 sm:py-3 hover:bg-yellow-500/10 transition duration-300 uppercase tracking-wider text-xs sm:text-sm font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
          >
            Get Started
          </motion.button>
        </div>
      </main>
      
      <motion.footer 
        className="absolute bottom-4 sm:bottom-6 w-full flex justify-center items-center z-20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex flex-col items-center">
          <div className="text-white font-bold text-xs sm:text-sm">Developed By</div>
          <a 
            href="https://prismas.in/"
            target='_blank'
            className='cursor-pointer'
          >
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={Prismas} alt="Company Logo" className="h-12 sm:h-16 md:h-20" />
          </motion.div>
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;