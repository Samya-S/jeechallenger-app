import { getServiceToken, attachServiceToken } from './internal-token';
import jwt from 'jsonwebtoken';

export const PYQS_API_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

/**
 * Creates an HS256 JWT signed with NEXTAUTH_SECRET for backend authentication.
 */
export function signUserToken(tokenOrId) {
  if (!tokenOrId) {
    throw new Error('pyqsService: token or userId is required to generate authentication token');
  }
  const payload = typeof tokenOrId === 'object' ? tokenOrId : { id: tokenOrId };
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256' });
}

/**
 * Generates authorization headers containing the signed Bearer token.
 */
export function getAuthHeaders(tokenOrId = null, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  attachServiceToken(headers, 'pyqs-service');
  if (tokenOrId) {
    const token = signUserToken(tokenOrId);
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Unified Go PYQs & CBT Microservice Client
 * Single Source of Truth for https://pyqs-api.jeechallenger.com
 */
export const pyqsService = {
  baseUrl: PYQS_API_URL,

  /**
   * Fetches paginated papers catalog.
   * Default caching: caller can pass `{ next: { revalidate: 300 } }` or `{ cache: 'no-store' }`.
   */
  async getPapers({ page = 1, limit = 12, ...rest } = {}, fetchOptions = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    }

    const headers = attachServiceToken(new Headers(fetchOptions.headers), 'pyqs-service');
    const res = await fetch(`${PYQS_API_URL}/papers?${params.toString()}`, { ...fetchOptions, headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch papers: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetches full paper details and embedded canonical questions by slug.
   */
  async getPaperBySlug(slug, fetchOptions = {}) {
    if (!slug) return null;

    try {
      const headers = attachServiceToken(new Headers(fetchOptions.headers), 'pyqs-service');
      const res = await fetch(`${PYQS_API_URL}/papers/${encodeURIComponent(slug)}`, {
        headers,
        cache: 'no-store',
        ...fetchOptions,
      });

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      const paper = json?.data || json;
      if (paper && Array.isArray(paper.questions) && paper.questions.length > 0) {
        return paper;
      }
      return paper || null;
    } catch (err) {
      console.error(`[pyqsService] Failed to fetch paper "${slug}":`, err);
      return null;
    }
  },

  /**
   * Fetches individual question by its slug.
   */
  async getQuestionBySlug(slug, fetchOptions = {}) {
    if (!slug) return null;

    try {
      const headers = attachServiceToken(new Headers(fetchOptions.headers), 'pyqs-service');
      const res = await fetch(`${PYQS_API_URL}/questions/${encodeURIComponent(slug)}`, { ...fetchOptions, headers });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json;
    } catch (err) {
      console.error(`[pyqsService] Failed to fetch question "${slug}":`, err);
      return null;
    }
  },

  /**
   * Fetches a playlist by its slug.
   */
  async getPlaylistBySlug(slug, { userId = null } = {}, fetchOptions = {}) {
    if (!slug) return null;

    try {
      const headers = userId ? getAuthHeaders(userId) : {};
      const res = await fetch(`${PYQS_API_URL}/playlists/${encodeURIComponent(slug)}`, {
        headers,
        cache: 'no-store',
        ...fetchOptions,
      });

      if (res.status === 403) {
        return { is_private: true, is_owner: false };
      }
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json;
    } catch (err) {
      console.error(`[pyqsService] Failed to fetch playlist "${slug}":`, err);
      return null;
    }
  },

  /**
   * Fetches all CBT submissions/attempts for a user (optionally filtered by paperId).
   */
  async getSubmissions({ userId, paperId = '', limit = 50 } = {}, fetchOptions = {}) {
    if (!userId) return [];

    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (paperId) {
        params.set('paper_id', paperId);
      }

      const res = await fetch(`${PYQS_API_URL}/cbt/submissions?${params.toString()}`, {
        headers: getAuthHeaders(userId),
        cache: 'no-store',
        ...fetchOptions,
      });

      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
    } catch (err) {
      console.error('[pyqsService] Failed to load submissions:', err);
      return [];
    }
  },

  /**
   * Fetches a single completed CBT submission by its unique MongoDB ID.
   */
  async getSubmissionById({ userId, submissionId }, fetchOptions = {}) {
    if (!userId || !submissionId) return null;

    try {
      const res = await fetch(`${PYQS_API_URL}/cbt/submissions/${encodeURIComponent(submissionId)}`, {
        headers: getAuthHeaders(userId),
        cache: 'no-store',
        ...fetchOptions,
      });

      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch (err) {
      console.error(`[pyqsService] Failed to fetch submission "${submissionId}":`, err);
      return null;
    }
  },

  /**
   * Fetches the user's persistent Mistake Vault items or count.
   */
  async getMistakeVault({ userId, subject = '', countOnly = false } = {}, fetchOptions = {}) {
    if (!userId) {
      return { savedQuestionIds: [], items: [], total: 0 };
    }

    try {
      const params = new URLSearchParams();
      if (subject && subject !== 'ALL') {
        params.set('subject', subject);
      }
      if (countOnly) {
        params.set('count_only', 'true');
      }

      const queryString = params.toString();
      const url = `${PYQS_API_URL}/cbt/mistake-vault${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        headers: getAuthHeaders(userId),
        cache: 'no-store',
        ...fetchOptions,
      });

      if (!res.ok) {
        return { savedQuestionIds: [], items: [], total: 0 };
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('[pyqsService] Error fetching mistake vault:', err);
      return { savedQuestionIds: [], items: [], total: 0 };
    }
  },

  /**
   * Toggles (adds/removes) a question in the user's Mistake Vault.
   */
  async toggleMistakeVaultItem({ userId, questionId }, fetchOptions = {}) {
    if (!userId || !questionId) {
      throw new Error('pyqsService: userId and questionId are required');
    }

    const res = await fetch(`${PYQS_API_URL}/cbt/mistake-vault`, {
      method: 'POST',
      headers: getAuthHeaders(userId, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ question_id: questionId }),
      ...fetchOptions,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: json.error || 'Failed to toggle mistake vault',
      };
    }

    return {
      ok: true,
      status: res.status,
      data: json,
    };
  },

  /**
   * Submits exam responses to the Go microservice for canonical scoring & persistence.
   */
  async submitExam({ userId, payload }, fetchOptions = {}) {
    if (!userId || !payload) {
      throw new Error('pyqsService: userId and payload are required for submission');
    }

    const res = await fetch(`${PYQS_API_URL}/cbt/submit`, {
      method: 'POST',
      headers: getAuthHeaders(userId, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
      ...fetchOptions,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Evaluation failed with status ${res.status}`);
    }

    const json = await res.json();
    const submission = json?.data;
    if (!submission) {
      throw new Error('Invalid response structure received from evaluation microservice');
    }

    return submission;
  },
};

export default pyqsService;
