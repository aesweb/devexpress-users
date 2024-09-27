# User Management System

This project is a User Management System built with React, utilizing the DevExtreme library for UI components and the DummyJSON API for mock data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:

   ```
   git clone git@github.com:aesweb/devexpress-users.git
   ```

2. Navigate to the project directory:

   ```
   cd devexpress-users
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

### Logging In

To log in to the application, you need to use credentials from the DummyJSON API. You can get a list of users from [https://dummyjson.com/users](https://dummyjson.com/users).

For example, you can use:

- Username: `emily.johnson@x.dummyjson.com`
- Password: `emilyspass`

### Features

1. **User List**: View a list of all users with basic information.
2. **User Details**: Click on a user to view and edit their detailed information.
3. **User's Cart**: View and edit the cart items for each user.
4. **Add User**: Add a new user to the system.
5. **Edit User**: Modify existing user information.
6. **Delete User**: Remove a user from the system.

## API Integration

This project uses the DummyJSON API for mock data. The main endpoints used are:

- `https://dummyjson.com/users`: For user data
- `https://dummyjson.com/carts/user/{userId}`: For user cart data

## Built With

- [React](https://reactjs.org/) - The web framework used
- [DevExtreme React Grid](https://js.devexpress.com/Documentation/Guide/UI_Components/DataGrid/Getting_Started_with_DataGrid/) - For data grid components
- [React Router](https://reactrouter.com/) - For routing

## Acknowledgments

- DummyJSON for providing the mock API
- DevExtreme for the excellent UI components
