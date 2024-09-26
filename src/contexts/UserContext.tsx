import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Diğer gerekli alanlar...
}

interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updatedUser: User | null;
  setUpdatedUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ users, setUsers, updatedUser, setUpdatedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};