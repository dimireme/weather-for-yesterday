'use client';

import { PropsWithChildren, useEffect } from 'react';
import { App } from 'antd';

import { setMessageInstance } from '@/utils/message';

export const MessageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return <App>{children}</App>;
};
