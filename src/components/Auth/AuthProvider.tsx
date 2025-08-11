import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Directeur' | 'Secrétaire' | 'Enseignant' | 'Comptable';
  permissions: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Utilisateurs de démonstration
  const users: Record<string, User> = {
    'admin@ecoletech.edu': {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@ecoletech.edu',
      role: 'Admin',
      permissions: ['all']
    },
    'directeur@ecoletech.edu': {
      id: '2',
      name: 'Dr. Amadou Sanogo',
      email: 'directeur@ecoletech.edu',
      role: 'Directeur',
      permissions: ['students', 'teachers', 'academic', 'reports', 'classes']
    },
    'secretaire@ecoletech.edu': {
      id: '3',
      name: 'Mme Fatoumata Keita',
      email: 'secretaire@ecoletech.edu',
      role: 'Secrétaire',
      permissions: ['students', 'classes']
    },
    'comptable@ecoletech.edu': {
      id: '4',
      name: 'M. Ibrahim Coulibaly',
      email: 'comptable@ecoletech.edu',
      role: 'Comptable',
      permissions: ['finance', 'reports']
    }
  };

  const passwords: Record<string, string> = {
    'admin@ecoletech.edu': 'admin123',
    'directeur@ecoletech.edu': 'directeur123',
    'secretaire@ecoletech.edu': 'secretaire123',
    'comptable@ecoletech.edu': 'comptable123'
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('ecoletech_user');
    const savedAuth = localStorage.getItem('ecoletech_auth');
    
    if (savedUser && savedAuth === 'true') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Nettoyer les données corrompues
        localStorage.removeItem('ecoletech_user');
        localStorage.removeItem('ecoletech_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    // Vérification des identifiants
    if (users[email] && passwords[email] === password) {
      const userData = users[email];
      setUser(userData);
      setIsAuthenticated(true);

      // Sauvegarder dans localStorage si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem('ecoletech_user', JSON.stringify(userData));
        localStorage.setItem('ecoletech_auth', 'true');
      }

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Nettoyer localStorage
    localStorage.removeItem('ecoletech_user');
    localStorage.removeItem('ecoletech_auth');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};