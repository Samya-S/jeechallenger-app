import clientPromise from '../../utils/mongodb.js';
import { ObjectId } from 'mongodb';

const DB_NAME = 'jee_challenger_syllabus_tracker';
const COLLECTION_NAME = 'progress';

export const syllabusTrackerService = {
  /**
   * Fetches syllabus progress for a specific user ID.
   */
  async getProgress(userId) {
    if (!userId) {
      throw new Error('syllabusTrackerService: userId is required');
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doc = await db.collection(COLLECTION_NAME).findOne({
      user_id: new ObjectId(userId),
    });

    return doc?.progress || {};
  },

  /**
   * Updates or upserts syllabus progress for a user ID.
   */
  async updateProgress(userId, progress) {
    if (!userId) {
      throw new Error('syllabusTrackerService: userId is required');
    }
    if (!progress) {
      throw new Error('syllabusTrackerService: progress data is required');
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION_NAME).updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: {
          progress,
          updated_at: new Date(),
        },
      },
      { upsert: true }
    );

    return { success: true };
  },
};

export default syllabusTrackerService;
