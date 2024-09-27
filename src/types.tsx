import { TreeViewTypes } from 'devextreme-react/tree-view';
import { ButtonTypes } from 'devextreme-react/button';
import React from 'react';

export interface HeaderProps {
  menuToggleEnabled: boolean;
  title?: string;
  toggleMenu: (e: ButtonTypes.ClickEvent) => void;
}

export interface SideNavigationMenuProps {
  selectedItemChanged: (e: TreeViewTypes.ItemClickEvent) => void;
  openMenu: (e: React.PointerEvent) => void;
  compactMode: boolean;
  onMenuReady: (e: TreeViewTypes.ContentReadyEvent) => void;
}

export interface UserPanelProps {
  menuMode: 'context' | 'list';
}

export interface User {
  email: string;
  avatarUrl: string;
}

export type AuthContextType = {
  user?: User;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ isOk: boolean; data?: User; message?: string }>;
  signOut: () => void;
  loading: boolean;
};

export interface SideNavToolbarProps {
  title: string;
}

export interface SingleCardProps {
  title?: string;
  description?: string;
}

export type Handle = () => void;

interface NavigationData {
  currentPath: string;
}

export type NavigationContextType = {
  setNavigationData?: ({ currentPath }: NavigationData) => void;
  navigationData: NavigationData;
};

export type ValidationType = {
  value: string;
};

export interface ExtendedUser extends User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  cartId?: number;
  thumbnail: string;
}
