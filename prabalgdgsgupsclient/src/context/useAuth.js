// context/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuth = () => {
  const { currentUser, loading } = useContext(AuthContext);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return {
    currentUser,
    loading,
    login,
    logout
  };
};