import axios from 'axios';
import Cookies from 'js-cookie';

type User = {
  email: string;
  password: string;
  avatarUrl: string;
};

export async function signIn(email: string, password: string) {
  try {
    const response = await axios.get('https://dummyjson.com/users');
    const users = response.data.users;

    const user = users.find(
      (user: User) => user.email === email && user.password === password
    );
    if (user) {
      Cookies.set(
        'user',
        JSON.stringify({ email: user.email, avatarUrl: user.avatarUrl })
      );
      return {
        isOk: true,
        data: { email: user.email, avatarUrl: user.avatarUrl },
      };
    } else {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  } catch (error) {
    return {
      isOk: false,
      message: 'Authentication failed',
    };
  }
}

export async function getUser() {
  try {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      return {
        isOk: true,
        data: JSON.parse(userCookie),
      };
    }
    return {
      isOk: false,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

// changePassword ve resetPassword fonksiyonlarını kaldırdık
