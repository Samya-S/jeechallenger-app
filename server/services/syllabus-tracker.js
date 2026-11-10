import { PYQS_API_URL, getAuthHeaders } from './pyqs';

export const syllabusTrackerService = {
  /**
   * Fetches syllabus progress for a specific user ID via Go microservice.
   */
  async getProgress(userId) {
    if (!userId) {
      throw new Error('syllabusTrackerService: userId is required');
    }

    const res = await fetch(`${PYQS_API_URL}/syllabus/progress`, {
      headers: getAuthHeaders(userId),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch syllabus progress from backend');
    }

    const data = await res.json();
    return data?.progress || {};
  },

  /**
   * Updates or upserts syllabus progress for a user ID via Go microservice.
   */
  async updateProgress(userId, progress) {
    if (!userId) {
      throw new Error('syllabusTrackerService: userId is required');
    }
    if (!progress) {
      throw new Error('syllabusTrackerService: progress data is required');
    }

    const res = await fetch(`${PYQS_API_URL}/syllabus/progress`, {
      method: 'POST',
      headers: getAuthHeaders(userId, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ progress }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update syllabus progress in backend');
    }

    return { success: true };
  },
};

export default syllabusTrackerService;
