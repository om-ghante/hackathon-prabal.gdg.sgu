import { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, Crown, Trophy, Users, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Prismas from '../assets/Prismas.svg';

const MainPage = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState('all');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  // House configuration with themed styling
  const houseMap = {
    'all': {
      name: 'All Houses',
      icon: <Shield size={18} />,
      bgGradient: 'from-gray-800 via-gray-700 to-gray-800',
      borderColor: 'border-gray-500',
      textColor: 'text-gray-300'
    },
    'House Stark': {
      name: 'House Stark',
      icon: <Crown size={18} />,
      bgGradient: 'from-blue-900 via-slate-800 to-gray-900',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-300'
    },
    'House Baratheon': {
      name: 'House Baratheon',
      icon: <Trophy size={18} />,
      bgGradient: 'from-yellow-900 via-amber-800 to-yellow-900',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-300'
    },
    'House Lannister': {
      name: 'House Lannister',
      icon: <Users size={18} />,
      bgGradient: 'from-red-900 via-rose-800 to-red-900',
      borderColor: 'border-red-500',
      textColor: 'text-red-300'
    },
    'House Targaryen': {
      name: 'House Targaryen',
      icon: <Shield size={18} />,
      bgGradient: 'from-purple-900 via-pink-800 to-red-900',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-300'
    }
  };

  const getHouseInfo = (house) => {
    return houseMap[house] || houseMap['all'];
  };

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch teams from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "teams")), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        revealDate: doc.data().createdAt // Using creation date as reveal date
      }));
      setAllTeams(teamsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return allTeams
      .filter(team => 
        (selectedHouse === 'all' || team.house === selectedHouse) &&
        (team.teamName.toLowerCase().includes(searchLower) ||
         team.teamLeader.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => b.points - a.points);
  }, [allTeams, selectedHouse, searchQuery]);

  // Group teams by house
  const groupedTeams = useMemo(() => {
    return filteredTeams.reduce((acc, team) => {
      const house = team.house || 'Unknown';
      if (!acc[house]) acc[house] = [];
      acc[house].push(team);
      return acc;
    }, {});
  }, [filteredTeams]);

  // Empty state content
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-xl bg-black/30 border border-dashed border-gray-700">
      <Hourglass className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl sm:text-2xl font-medium text-gray-300 mb-2">
        {searchQuery ? 'No matching teams found' : 'No teams registered yet'}
      </h3>
      <p className="text-gray-400 mb-4 text-center">
        {searchQuery ? 'Try a different search term' : 'Check back later for registered teams'}
      </p>
      {!searchQuery && <CountdownTimer />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-black via-blue-900/20 to-black">
      <main className="container px-4 sm:px-6 py-6 sm:py-8 mx-auto">
        <header className="w-full flex flex-col items-center">
          <div className="w-full bg-gray-900 text-white py-4 px-4 mb-4 text-center">
            <h1 className="text-xl font-bold mb-1">PRABAL</h1>
            <p className="text-sm italic">Hack it, Till you make it!</p>
          </div>
        </header>

        {/* House Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(houseMap).map((house) => {
            const houseInfo = getHouseInfo(house);
            return (
              <button
                key={house}
                onClick={() => setSelectedHouse(house)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedHouse === house
                    ? `bg-gradient-to-r ${houseInfo.bgGradient} text-white shadow-md`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{houseInfo.icon}</span>
                  {houseInfo.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 p-6 bg-black/30 rounded-xl border border-blue-800/50 shadow-lg">
            <Hourglass className="animate-spin text-blue-500 mb-4 w-12 h-12 sm:w-16 sm:h-16" />
            <div className="text-xl sm:text-2xl font-medium text-gray-300">
              Loading teams...
            </div>
          </div>
        ) : (
          <>
            {/* Team Leaderboards */}
            {filteredTeams.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="space-y-8 w-full">
                <AnimatePresence>
                  {Object.entries(groupedTeams).map(([houseName, teams]) => {
                    const houseInfo = getHouseInfo(houseName);
                    return (
                      <motion.div
                        key={houseName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl border ${houseInfo.borderColor} overflow-hidden shadow-lg bg-gray-800`}
                      >
                        <div className="p-4 bg-gradient-to-r ${houseInfo.bgGradient}">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {houseInfo.icon}
                            {houseName} Leaderboard
                          </h2>
                        </div>
                        
                        <div className="space-y-4 p-4">
                          {teams.map((team, index) => (
                            <motion.div
                              key={team.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-gray-400 w-8">
                                  {index + 1}.
                                </span>
                                <div>
                                  <h3 className="font-medium text-white">{team.teamName}</h3>
                                  <p className="text-sm text-gray-400">{team.teamLeader}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-black/20 rounded-full text-sm font-medium text-white">
                                  {team.points} pts
                                </span>
                                <span className="text-sm text-gray-400">
                                  {team.house}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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