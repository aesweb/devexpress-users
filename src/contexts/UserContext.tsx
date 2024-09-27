import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { ExtendedUser, CartProduct } from '../types';

interface UserContextType {
  users: ExtendedUser[];
  setUsers: React.Dispatch<React.SetStateAction<ExtendedUser[]>>;
  updatedUser: ExtendedUser | null;
  setUpdatedUser: (user: ExtendedUser | null) => void;
  cartProducts: { [userId: number]: CartProduct[] };
  setCartProducts: React.Dispatch<
    React.SetStateAction<{ [userId: number]: CartProduct[] }>
  >;
  addUser: (user: ExtendedUser) => void;
  updateUser: (user: ExtendedUser) => void;
  deleteUser: (userId: number) => void;
  addCartProduct: (userId: number, product: CartProduct) => void;
  updateCartProduct: (userId: number, product: CartProduct) => void;
  deleteCartProduct: (userId: number, productId: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [updatedUser, setUpdatedUser] = useState<ExtendedUser | null>(null);
  const [cartProducts, setCartProducts] = useState<{
    [userId: number]: CartProduct[];
  }>({});

  const addUser = useCallback((user: ExtendedUser) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  }, []);

  const updateUser = useCallback((user: ExtendedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? user : u))
    );
    setUpdatedUser(user);
  }, []);

  const deleteUser = useCallback((userId: number) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    setCartProducts((prevCartProducts) => {
      const { [userId]: _, ...rest } = prevCartProducts;
      return rest;
    });
  }, []);

  const addCartProduct = useCallback((userId: number, product: CartProduct) => {
    setCartProducts((prevCartProducts) => ({
      ...prevCartProducts,
      [userId]: [...(prevCartProducts[userId] || []), product],
    }));
  }, []);

  const updateCartProduct = useCallback(
    (userId: number, product: CartProduct) => {
      setCartProducts((prevCartProducts) => ({
        ...prevCartProducts,
        [userId]: prevCartProducts[userId].map((p) =>
          p.id === product.id ? product : p
        ),
      }));
    },
    []
  );

  const deleteCartProduct = useCallback((userId: number, productId: number) => {
    setCartProducts((prevCartProducts) => ({
      ...prevCartProducts,
      [userId]: prevCartProducts[userId].filter((p) => p.id !== productId),
    }));
  }, []);

  const value = {
    users,
    setUsers,
    updatedUser,
    setUpdatedUser,
    cartProducts,
    setCartProducts,
    addUser,
    updateUser,
    deleteUser,
    addCartProduct,
    updateCartProduct,
    deleteCartProduct,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
