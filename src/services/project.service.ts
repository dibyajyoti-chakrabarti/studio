import { db } from '@/firebase/config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { logger } from '@/utils/logger';

/**
 * ProjectService manages the lifecycle of innovation projects on MechHub.
 * This includes RFQ submissions, project creation, and part management.
 */
export const ProjectService = {
  /**
   * Submits a new Project RFQ.
   */
  async submitProjectRfq(data: any) {
    const rfqRef = doc(collection(db, 'projectRFQs'));
    const rfqData = {
      ...data,
      id: rfqRef.id,
      status: 'submitted',
      shortlistedVendorIds: data.selectedVendorIds,
      assignedVendorId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(rfqRef, rfqData);
    logger.info({ 
      event: 'Project RFQ submitted successfully', 
      rfqId: rfqRef.id,
      projectName: data.projectName 
    });
    return rfqRef.id;
  },

  /**
   * Retrieves a Project RFQ by its ID.
   */
  async getProjectRfqById(id: string) {
    try {
      const rfqRef = doc(db, 'projectRFQs', id);
      const docSnap = await getDoc(rfqRef);
      if (!docSnap.exists()) return null;
      return docSnap.data();
    } catch (error) {
      logger.error({ event: 'Failed to fetch Project RFQ', error, rfqId: id });
      throw error;
    }
  },

  /**
   * Fetches all RFQs belonging to a specific user.
   */
  async getUserProjectRfqs(userId: string) {
    try {
      const q = query(collection(db, 'projectRFQs'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error({ event: 'Failed to fetch user Project RFQs', error, userId });
      throw error;
    }
  }
};
