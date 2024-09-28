import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/userUtils';

const UserProfile = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo(userId);
        setUserInfo(info);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>ID: {userInfo.id}</p>
      <p>Email: {userInfo.email}</p>
    </div>
  );
};

export default UserProfile;