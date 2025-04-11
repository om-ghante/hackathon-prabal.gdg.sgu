import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [revealDate, setRevealDate] = useState('');
  const [revealTime, setRevealTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [problemStatements, setProblemStatements] = useState([]);
  const [expandedProblem, setExpandedProblem] = useState(null);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "problemStatements"), orderBy("revealDate", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const now = new Date();
      const statements = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const revealDate = data.revealDate.toDate();
        return {
          id: doc.id,
          ...data,
          isRevealed: revealDate <= now
        };
      });
      setProblemStatements(statements);

      // Set timeouts for upcoming reveals
      statements.forEach(problem => {
        if (!problem.isRevealed) {
          const timeUntilReveal = problem.revealDate.toDate() - now;
          if (timeUntilReveal > 0) {
            setTimeout(() => {
              setProblemStatements(prev => 
                prev.map(p => 
                  p.id === problem.id 
                    ? {...p, isRevealed: true} 
                    : p
                )
              );
            }, timeUntilReveal);
          }
        }
      });
    });

    // Set interval as fallback (in case setTimeout fails)
    const intervalId = setInterval(() => {
      setProblemStatements(prev => 
        prev.map(problem => ({
          ...problem,
          isRevealed: problem.revealDate.toDate() <= new Date()
        }))
      );
    }, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !domain || !revealDate || !revealTime) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dateTimeString = `${revealDate}T${revealTime}`;
      const revealDateTime = new Date(dateTimeString);
      
      await addDoc(collection(db, "problemStatements"), {
        title,
        description,
        domain,
        revealDate: Timestamp.fromDate(revealDateTime),
        createdBy: currentUser.uid,
        createdAt: Timestamp.now()
      });
      
      setMessage({ type: 'success', text: 'Problem statement added successfully!' });
      setTitle('');
      setDescription('');
      setDomain('');
      setRevealDate('');
      setRevealTime('');
    } catch (error) {
      console.error("Error adding problem statement:", error);
      setMessage({ type: 'error', text: 'Failed to add problem statement. Please try again.' });
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem statement?')) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, "problemStatements", id));
        setMessage({ type: 'success', text: 'Problem statement deleted successfully!' });
      } catch (error) {
        console.error("Error deleting problem statement:", error);
        setMessage({ type: 'error', text: 'Failed to delete problem statement. Please try again.' });
      }
      setIsDeleting(false);
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

  const toggleExpandProblem = (id) => {
    setExpandedProblem(expandedProblem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-white">Hackathon Dashboard</h1>
            <p className="text-indigo-100">Manage problem statements</p>
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
          {/* Add Problem Statement Form */}
          <div className="col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <PlusCircle className="text-indigo-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Add New Problem</h2>
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
                  <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Problem statement title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Detailed description of the problem"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="domain" className="block mb-2 text-sm font-medium text-gray-700">Domain</label>
                  <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. AI, Web Development, IoT"
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revealDate" className="flex items-center gap-1 mb-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} />
                      Reveal Date
                    </label>
                    <input
                      type="date"
                      id="revealDate"
                      value={revealDate}
                      onChange={(e) => setRevealDate(e.target.value)}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="revealTime" className="flex items-center gap-1 mb-2 text-sm font-medium text-gray-700">
                      <Clock size={16} />
                      Reveal Time
                    </label>
                    <input
                      type="time"
                      id="revealTime"
                      value={revealTime}
                      onChange={(e) => setRevealTime(e.target.value)}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
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
                      Add Problem Statement
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Problem Statements List */}
          <div className="col-span-2">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">Problem Statements</h2>
              
              {problemStatements.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No problem statements added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {problemStatements.map((problem) => {
                    const revealDateTime = problem.revealDate.toDate();
                    const isExpanded = expandedProblem === problem.id;
                    
                    return (
                      <div key={problem.id} className="overflow-hidden border border-gray-200 rounded-lg">
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpandProblem(problem.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              problem.isRevealed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {problem.isRevealed ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Clock size={20} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{problem.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 rounded-full">{problem.domain}</span>
                                <span>•</span>
                                <span>{revealDateTime.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              problem.isRevealed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {problem.isRevealed ? 'Revealed' : 'Scheduled'}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(problem.id);
                              }}
                              disabled={isDeleting}
                              className="p-1.5 text-gray-500 transition-colors rounded-full hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
                            <h4 className="mb-2 text-sm font-medium text-gray-700">Description</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{problem.description}</p>
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