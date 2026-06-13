// Configuration for API endpoints - using Next.js API routes with rewrites
export const API_ENDPOINTS = {
  AUTH: {
    ME: '/api/auth/me',
  },
  CHATS: {
    LIST: '/api/chats',
    CREATE: '/api/chats',
    GET: (chatId) => `/api/chats/${chatId}`,
    UPDATE: (chatId) => `/api/chats/${chatId}`,
    DELETE: (chatId) => `/api/chats/${chatId}`,
    MESSAGES: (chatId) => `/api/chats/${chatId}/messages`,
  },
  FILES: {
    UPLOAD: '/api/files/upload',
    LIST: '/api/files',
    GET: (fileId) => `/api/files/${fileId}`,
    DELETE: (fileId) => `/api/files/${fileId}`,
  },
};
