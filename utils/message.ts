import type { MessageInstance } from 'antd/es/message/interface';

let messageInstance: MessageInstance | null = null;

export const setMessageInstance = (instance: MessageInstance) => {
  messageInstance = instance;
};

export const message = {
  success: (content: string) => {
    if (messageInstance) {
      messageInstance.success(content);
    }
  },
  error: (content: string) => {
    if (messageInstance) {
      messageInstance.error(content);
    }
  },
  info: (content: string) => {
    if (messageInstance) {
      messageInstance.info(content);
    }
  },
  warning: (content: string) => {
    if (messageInstance) {
      messageInstance.warning(content);
    }
  },
  loading: (content: string) => {
    if (messageInstance) {
      return messageInstance.loading(content);
    }
    return () => {};
  },
};
