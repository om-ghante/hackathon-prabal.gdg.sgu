import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Sword, Shield, ScrollText, Castle, Skull, Hourglass, 
  BookOpen, Wand2, Scroll, Crown, TowerControl 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Prismas from '../assets/Prismas.svg'

const MainPage = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [domains, setDomains] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Domain mapping with blue/black theme
  const domainMap = {
    'AI': { 
      name: 'Artificial Intelligence', 
      icon: <BookOpen size={18} />,
      category: 'Machine Learning',
      color: 'bg-blue-900'
    },
    'Web Development': { 
      name: 'Web Development', 
      icon: <Castle size={18} />,
      category: 'Frontend/Backend',
      color: 'bg-indigo-900'
    },
    'IoT': { 
      name: 'Internet of Things', 
      icon: <Wand2 size={18} />,
      category: 'Embedded Systems',
      color: 'bg-blue-800'
    },
    'Blockchain': { 
      name: 'Blockchain', 
      icon: <Scroll size={18} />,
      category: 'Decentralized Tech',
      color: 'bg-blue-950'
    },
    'Cybersecurity': { 
      name: 'Cybersecurity', 
      icon: <Shield size={18} />,
      category: 'Security',
      color: 'bg-gray-900'
    },
    'Data Science': { 
      name: 'Data Science', 
      icon: <ScrollText size={18} />,
      category: 'Analytics',
      color: 'bg-slate-900'
    },
    'default': { 
      name: 'General', 
      icon: <Sword size={18} />,
      category: 'Miscellaneous',
      color: 'bg-gray-800'
    }
  };

  const getDomainInfo = (domain) => {
    if (!domain) return domainMap['default'];
    return domainMap[domain] || domainMap['default'];
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "problemStatements"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const statements = [];
      const domainsSet = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        statements.push({ 
          id: doc.id, 
          ...data,
          revealDate: data.revealDate
        });
        domainsSet.add(data.domain);
      });

      setAllProblems(statements);
      setDomains(Array.from(domainsSet));
      setLoading(false);

      statements.forEach(problem => {
        const revealTime = problem.revealDate.toDate().getTime();
        const now = Date.now();
        
        if (revealTime > now) {
          const timeout = setTimeout(() => {
            setCurrentTime(Date.now());
          }, revealTime - now);
          
          return () => clearTimeout(timeout);
        }
      });
    });

    return unsubscribe;
  }, []);

  const visibleProblems = useMemo(() => {
    return allProblems.filter(problem => 
      problem.revealDate.toDate().getTime() <= currentTime
    );
  }, [allProblems, currentTime]);

  const filteredProblems = useMemo(() => {
    return selectedDomain === 'all' 
      ? visibleProblems 
      : visibleProblems.filter(prob => prob.domain === selectedDomain);
  }, [visibleProblems, selectedDomain]);

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-black via-blue-900/20 to-black">
      {/* Header */}
      <header className="relative bg-gradient-to-b from-black to-blue-900/10 shadow-xl">
        <div className="container px-4 sm:px-6 py-8 mx-auto text-center">
          <div className="mb-4 sm:mb-6 flex justify-center space-x-3 sm:space-x-4">
            <Crown className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            <TowerControl className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10 animate-pulse delay-75" />
            <Crown className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10 animate-pulse delay-150" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-400 tracking-wider">
            CODE CHALLENGES
          </h1>
          <p className="mt-2 sm:mt-4 text-lg sm:text-xl text-gray-300 italic">
            "Push your limits, solve problems, grow stronger"
          </p>
          <div className="mt-6 sm:mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500/80 to-transparent" />
        </div>
      </header>

      <main className="container px-4 sm:px-6 py-6 sm:py-8 mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 p-6 bg-black/70 rounded-xl border border-blue-800/50 shadow-lg">
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
            {/* Filter Section */}
            <div className="mb-6 sm:mb-8 p-6 sm:p-8 bg-black/70 rounded-xl border border-blue-800/50 shadow-lg">
              <div className="max-w-2xl mx-auto">
                <label htmlFor="domain-filter" className="block text-lg sm:text-xl font-medium text-blue-400 mb-3 sm:mb-4">
                  <ScrollText className="inline-block mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                  Filter by Domain:
                </label>
                <div className="relative">
                  <select
                    id="domain-filter"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="block w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 bg-black/80 text-gray-200 border border-blue-700/50 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none transition-all hover:border-blue-500/70 text-sm sm:text-base"
                  >
                    <option value="all" className="bg-gray-900">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain} className="bg-gray-900">
                        {getDomainInfo(domain).name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                    <Sword className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Problem Cards */}
            {filteredProblems.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-black/70 rounded-xl border border-blue-800/50 shadow-lg">
                <Skull className="mx-auto text-blue-500 mb-4 sm:mb-6 w-12 h-12 sm:w-16 sm:h-16" />
                <p className="text-xl sm:text-2xl text-gray-300 italic">
                  "No challenges found in this category"
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProblems.map((problem) => {
                  const domainInfo = getDomainInfo(problem.domain);
                  return (
                    <div 
                      key={problem.id} 
                      className={`group p-6 sm:p-8 bg-black/80 rounded-xl border ${domainInfo.color}/30 hover:border-blue-500/50 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
                      <div className="relative z-10">
                        {/* Domain Banner */}
                        <div className={`${domainInfo.color} px-3 py-1 sm:px-4 sm:py-2 rounded-t-lg absolute -top-px -left-px -right-px text-xs sm:text-sm`}>
                          <span className="font-bold text-white tracking-wider">
                            {domainInfo.category.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4 sm:mb-6 mt-7 sm:mt-8">
                          <div className="text-blue-400 p-2 bg-black/30 rounded-lg">
                            {domainInfo.icon}
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wider">
                            {problem.title}
                          </h2>
                        </div>

                        <p className="mb-4 sm:mb-6 text-gray-300 leading-relaxed border-l-2 border-blue-500/30 pl-3 sm:pl-4 italic text-sm sm:text-base">
                          {problem.description}
                        </p>

                        <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-blue-800/50 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 sm:gap-3 text-blue-400/90">
                            <Hourglass className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>
                              Posted: {problem.revealDate.toDate().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer 
        className="absolute bottom-2 w-full flex justify-center items-center z-20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <a href="https://prismas.in/" target='_blank'>
        <div className="flex flex-col items-center">
          <div className="text-white font-bold text-sm">Developed By</div>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={Prismas} alt="Company Logo" className="h-25" />
          </motion.div>
        </div>
        </a>
      </motion.footer>
    </div>
  );
};

export default MainPage;