'use client';

import React from 'react';
import { App, ConfigProvider } from 'antd';
import ProfileConfiguration from './ProfileConfigurationPage';

interface ProfileConfigurationWrapperProps {
  className?: string;
  usersService?: {
    generateAvatarUrl: (user: any) => string;
  };
}

const ProfileConfigurationWrapper: React.FC<ProfileConfigurationWrapperProps> = (props) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <App>
        <ProfileConfiguration {...props} />
      </App>
    </ConfigProvider>
  );
};

export default ProfileConfigurationWrapper;