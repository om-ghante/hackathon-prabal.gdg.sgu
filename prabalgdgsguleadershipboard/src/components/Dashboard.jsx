import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  PlusCircle, 
  Trash2, 
  Shield,
  User,
  Phone,
  Award,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const Dashboard = () => {
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [phone, setPhone] = useState('');
  const [house, setHouse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [teams, setTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("points", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const teamsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamName || !teamLeader || !phone || !house) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "teams"), {
        teamName,
        teamLeader,
        phone,
        house,
        points: 500,
        createdBy: currentUser.uid,
        createdAt: new Date()
      });
      
      setMessage({ type: 'success', text: 'Team added successfully!' });
      setTeamName('');
      setTeamLeader('');
      setPhone('');
      setHouse('');
    } catch (error) {
      console.error("Error adding team:", error);
      setMessage({ type: 'error', text: 'Failed to add team. Please try again.' });
    }
    
    setIsSubmitting(false);
  };


  const handlePointsChange = async (teamId, operation) => {
    const teamRef = doc(db, "teams", teamId);
    try {
      await updateDoc(teamRef, {
        points: operation === 'add' ? 
          increment(100) : 
          decrement(100)
      });
    } catch (error) {
      console.error("Error updating points:", error);
      setMessage({ type: 'error', text: 'Failed to update points' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteDoc(doc(db, "teams", id));
        setMessage({ type: 'success', text: 'Team deleted successfully!' });
      } catch (error) {
        console.error("Error deleting team:", error);
        setMessage({ type: 'error', text: 'Failed to delete team. Please try again.' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleExpandTeam = (id) => {
    setExpandedTeam(expandedTeam === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-white">Hackathon Team Dashboard</h1>
            <p className="text-indigo-100">Manage teams and points</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-700 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Add Team Form */}
          <div className="col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <PlusCircle className="text-indigo-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Add New Team</h2>
              </div>
              
              {message.text && (
                <div className={`flex items-start gap-2 p-4 mb-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-100' 
                    : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="mt-0.5 flex-shrink-0" size={18} />
                  ) : (
                    <AlertTriangle className="mt-0.5 flex-shrink-0" size={18} />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="teamName" className="block mb-2 text-sm font-medium text-gray-700">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="teamLeader" className="block mb-2 text-sm font-medium text-gray-700">
                    Team Leader
                  </label>
                  <input
                    type="text"
                    id="teamLeader"
                    value={teamLeader}
                    onChange={(e) => setTeamLeader(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="house" className="block mb-2 text-sm font-medium text-gray-700">
                    House
                  </label>
                  <select
                    id="house"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select House</option>
                    <option value="House Stark">House Stark</option>
                    <option value="House Baratheon">House Baratheon</option>
                    <option value="House Lannister">House Lannister</option>
                    <option value="House Targaryen">House Targaryen</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Award className="text-yellow-600" size={18} />
                    Initial Points: 500
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Register Team
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Teams List */}
          <div className="col-span-2">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">Registered Teams</h2>
              
              {teams.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No teams registered yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => {
                    const isExpanded = expandedTeam === team.id;
                    
                    return (
                      <div key={team.id} className="overflow-hidden border border-gray-200 rounded-lg">
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpandTeam(team.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600`}>
                              <Shield size={20} />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{team.teamName}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 rounded-full">{team.house}</span>
                                <span>•</span>
                                <span>{team.teamLeader}</span>
                                <span>•</span>
                                <span>{team.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePointsChange(team.id, 'subtract');
                                }}
                                className="px-3 py-1 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                              >
                                -100
                              </button>
                              <span className="px-3 py-1 bg-gray-100 rounded-md">
                                {team.points}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePointsChange(team.id, 'add');
                                }}
                                className="px-3 py-1 text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                              >
                                +100
                              </button>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(team.id);
                              }}
                              className="p-1.5 text-gray-500 transition-colors rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
                            {isExpanded ? (
                              <ChevronUp size={20} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-gray-700">Team Leader:</p>
                                <p className="text-gray-600">{team.teamLeader}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700">Contact:</p>
                                <p className="text-gray-600">{team.phone}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700">House:</p>
                                <p className="text-gray-600">{team.house}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700">Points:</p>
                                <p className="text-gray-600">{team.points}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;