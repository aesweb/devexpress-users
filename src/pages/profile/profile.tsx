import React, { useState, useEffect } from 'react';
import './profile.scss';
import Form, { Item } from 'devextreme-react/form';
import { useAuth } from '../../contexts/auth';

export default function Profile() {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        try {
          const response = await fetch(`https://dummyjson.com/users/search?q=${user.email}`);
          const data = await response.json();
          if (data.users && data.users.length > 0) {
            setUserData(data.users[0]);
            setNotes(data.users[0].company?.title || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Profile</h2>

      <div className={'content-block dx-card responsive-paddings'}>
        <div className={'form-avatar'}>
          <img
            alt={''}
            src={userData.image || user?.avatarUrl}
          />
        </div>
        <span>{notes}</span>
      </div>

      <div className={'content-block dx-card responsive-paddings'}>
        <Form
          id={'form'}
          defaultFormData={userData}
          onFieldDataChanged={(e) => {
            if (e.dataField === 'company.title') {
              setNotes(e.value);
            }
          }}
          labelLocation={'top'}
          colCountByScreen={colCountByScreen}
        >
          <Item dataField={'firstName'} />
          <Item dataField={'lastName'} />
          <Item dataField={'email'} />
          <Item dataField={'phone'} />
          <Item dataField={'address.address'} />
          <Item dataField={'company.title'} />
        </Form>
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};
