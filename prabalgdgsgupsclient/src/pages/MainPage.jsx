import { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BookOpen, Castle, Scroll, Sword, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import Prabal from '../assets/praballogo.jpg';
import Prismas from '../assets/Prismas.svg';

const MainPage = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [domains, setDomains] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced domain mapping with better visual cues
  const domainMap = {
    'AI & ML': { 
      name: 'AI/ML', 
      icon: <BookOpen size={18} />,
      category: 'Artificial Intelligence & Machine Learning',
      bgGradient: 'from-purple-900 via-blue-800 to-indigo-900',
      borderColor: 'border-indigo-500',
      textColor: 'text-indigo-300'
    },
    'Web Development': { 
      name: 'Web Dev', 
      icon: <Castle size={18} />,
      category: 'Web Application Developement',
      bgGradient: 'from-blue-900 via-cyan-800 to-sky-900',
      borderColor: 'border-cyan-500',
      textColor: 'text-cyan-300'
    },
    'Blockchain': { 
      name: 'Blockchain', 
      icon: <Scroll size={18} />,
      category: 'Blockchain Development',
      bgGradient: 'from-emerald-900 via-teal-800 to-green-900',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-300'
    },
    'App Development': { 
      name: 'App Dev', 
      icon: <Sword size={18} />,
      category: 'Mobile App Development',
      bgGradient: 'from-gray-800 via-gray-700 to-gray-800',
      borderColor: 'border-gray-500',
      textColor: 'text-gray-300'
    }
  };

  const getDomainInfo = (domain) => {
    return domainMap[domain] || domainMap['default'];
  };

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch problems from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "problemStatements")), (snapshot) => {
      const statements = [];
      const domainsSet = new Set(['all']); // Start with 'all' option
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        statements.push({ 
          id: doc.id, 
          ...data,
          revealDate: data.revealDate
        });
        if (data.domain) domainsSet.add(data.domain);
      });

      setAllProblems(statements);
      setDomains(Array.from(domainsSet));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Filter visible problems based on time and search
  const visibleProblems = useMemo(() => {
    return allProblems
      .filter(problem => problem.revealDate.toDate().getTime() <= currentTime)
      .filter(problem => 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allProblems, currentTime, searchQuery]);

  // Filter by selected domain
  const filteredProblems = useMemo(() => {
    return selectedDomain === 'all' 
      ? visibleProblems 
      : visibleProblems.filter(prob => prob.domain === selectedDomain);
  }, [visibleProblems, selectedDomain]);

  // Empty state content
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-xl bg-black/30 border border-dashed border-gray-700">
      <Hourglass className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl sm:text-2xl font-medium text-gray-300 mb-2">
        {searchQuery ? 'No matching challenges found' : 'No challenges available yet'}
      </h3>
      <p className="text-gray-400 mb-4 text-center">
        {searchQuery ? 'Try a different search term' : 'Check back later for new challenges'}
      </p>
      {!searchQuery && <CountdownTimer />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-black via-blue-900/20 to-black">
      <main className="container px-4 sm:px-6 py-6 sm:py-8 mx-auto">
      <header className="w-full flex flex-col items-center">
  
  {/* Slogan Section - appears below the image */}
  <div className="w-full bg-gray-900 text-white py-4 px-4 mb-4 text-center">
    <h1 className="text-xl font-bold mb-1">PRABAL</h1>
    <p className="text-sm italic">Hack it, Till you make it!</p>
  </div>
</header>
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 p-6 bg-black/30 rounded-xl border border-blue-800/50 shadow-lg">
            <div className="relative mb-6">
              <Hourglass className="animate-spin text-blue-500 mb-4 w-12 h-12 sm:w-16 sm:h-16" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent rounded-full" />
            </div>
            <div className="text-xl sm:text-2xl font-medium text-gray-300">
              Loading challenges...
            </div>
          </div>
        ) : (
          <>
            {/* Problem Cards */}
            {filteredProblems.length === 0 ? (
              renderEmptyState()
            ) : (
                          <div className="space-y-6 w-full">
              <AnimatePresence>
                {filteredProblems.map((problem) => {
                  const domainInfo = getDomainInfo(problem.domain);
                  return (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full flex flex-col rounded-xl border ${domainInfo.borderColor} overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-gray-800`}
                    >
                      <div className="relative h-full flex flex-col p-6">
                        {/* Domain Header */}
                        <div className="flex items-center mb-4">
                          <div className={`p-2 rounded-lg ${domainInfo.textColor}`}>
                            {domainInfo.icon}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-white/80">{domainInfo.category}</h3>
                            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                          </div>
                        </div>
            
                        {/* Problem Description */}
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-4">
                          <p className="text-gray-200 text-sm leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
            
                        {/* Footer */}
                        <div className="mt-auto pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                          <div className="flex items-center text-xs text-white/70">
                            <Hourglass className="w-4 h-4 mr-1" />
                            <span>
                              Posted : {problem.revealDate.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            
              {/* Results Count */}
              <div className="text-sm text-gray-400">
                Showing {filteredProblems.length} of {visibleProblems.length} challenges
              </div>
            </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer 
        className="py-4 w-full flex justify-center items-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <a href="https://prismas.in/" target='_blank' rel="noopener noreferrer">
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-white font-bold text-sm mb-1">Developed By</div>
            <img src={Prismas} alt="Prismas Logo" className="h-14" />
          </motion.div>
        </a>
      </motion.footer>
    </div>
  );
};

export default MainPage;