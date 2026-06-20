// Configuration for API endpoints - using Next.js API routes with rewrites
export const API_ENDPOINTS = {
  AUTH: {
    ME: '/api/auth/me', // NextAuth
  },
  CHATS: {
    LIST: '/api/ai/chats',
    CREATE: '/api/ai/chats',
    GET: (chatId) => `/api/ai/chats/${chatId}`,
    UPDATE: (chatId) => `/api/ai/chats/${chatId}`,
    DELETE: (chatId) => `/api/ai/chats/${chatId}`,
    MESSAGES: (chatId) => `/api/ai/chats/${chatId}/messages`,
  },
  FILES: {
    UPLOAD: '/api/ai/files/upload',
    LIST: '/api/ai/files',
    GET: (fileId) => `/api/ai/files/${fileId}`,
    DELETE: (fileId) => `/api/ai/files/${fileId}`,
  },
};
