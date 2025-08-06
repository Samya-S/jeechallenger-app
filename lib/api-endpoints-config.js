// Configuration for API endpoints - using Next.js API routes with rewrites
export const API_ENDPOINTS = {
  AUTH: {
    ME: '/api/auth/me',
  },
  CHAT: {
    SEND: '/api/chat',
    HISTORY: '/api/chat/history',
  },
  FILES: {
    UPLOAD: '/api/files/upload',
    LIST: '/api/files',
    GET: (fileId) => `/api/files/${fileId}`,
    DELETE: (fileId) => `/api/files/${fileId}`,
  },
}; 