import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Diğer gerekli alanlar...
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  cartId?: number;
}

interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updatedUser: User | null;
  setUpdatedUser: (user: User | null) => void;
  cartProducts: { [userId: number]: CartProduct[] };
  setCartProducts: React.Dispatch<React.SetStateAction<{ [userId: number]: CartProduct[] }>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [cartProducts, setCartProducts] = useState<{ [userId: number]: CartProduct[] }>({});

  return (
    <UserContext.Provider value={{ users, setUsers, updatedUser, setUpdatedUser, cartProducts, setCartProducts }}>
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