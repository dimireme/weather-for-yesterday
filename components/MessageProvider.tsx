'use client';

import { PropsWithChildren, useEffect } from 'react';
import { App } from 'antd';

import { setMessageInstance } from '@/utils/message';

const MessageBridge: React.FC = () => {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return null;
};

export const MessageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <App>
      <MessageBridge />
      {children}
    </App>
  );
};
