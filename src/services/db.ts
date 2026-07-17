import { collection, addDoc, getDocs, getDoc, query, orderBy, where, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CandidateProfile, SystemLog } from '../types';

// Collection name with 'portal_' prefix to ensure safety and isolation
const COLLECTION_NAME = 'portal_candidates';
const LOGS_COLLECTION = 'portal_logs';

/**
 * Helper to get the current user's email from local storage
 */
const getCurrentUserEmail = (): string => {
  const saved = localStorage.getItem('nexhire_user');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      return user.email || 'System';
    } catch (e) {}
  }
  return 'Unknown User';
};

/**
 * Saves a new system log to Firestore
 */
export const logSystemEvent = async (action: string, details: string, category: SystemLog['category'], candidateId?: string): Promise<void> => {
  try {
    const logData: SystemLog = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: getCurrentUserEmail(),
      category,
      ...(candidateId && { candidateId })
    };
    await addDoc(collection(db, LOGS_COLLECTION), logData);
  } catch (error) {
    console.error("Error saving system log: ", error);
  }
};

/**
 * Saves a new candidate profile to Firestore
 */
export const saveCandidateToDb = async (profile: CandidateProfile): Promise<string> => {
  try {
    const isUpdate = !!profile.id;
    let docId = profile.id || '';

    // Create a detailed system log entry with the actual data
    const detailedData = [
      `Name: ${profile.firstName} ${profile.lastName}`,
      `Contact: ${profile.mobileNumber}`,
      `Job Preferred: ${profile.jobPreference || 'N/A'}`,
      `Country: ${profile.countryLookingFor || 'N/A'}`,
      `Passport: ${profile.passportAvailable || 'No'}`,
      `HR: ${profile.assignedToHR || 'None'}`,
      `Interest: ${profile.interestLevel || 'N/A'}`,
      `Status: ${profile.serviceChargesStatus || 'N/A'}`
    ].join(' | ');

    if (isUpdate) {
      // Fetch existing document to compute what changed
      const docRef = doc(db, COLLECTION_NAME, docId);
      const docSnap = await getDoc(docRef);
      
      let diffString = "Updated profile fields.";
      if (docSnap.exists()) {
        const oldData = docSnap.data();
        const changes: string[] = [];
        const ignoredKeys = ['id', 'createdAt', 'updatedAt'];
        
        // Loop through every single field in the new profile
        for (const [key, newVal] of Object.entries(profile)) {
          if (ignoredKeys.includes(key)) continue;
          
          const oldVal = oldData[key];
          
          // Only compare simple text/number/boolean fields to keep logs readable
          if (typeof newVal !== 'object' && typeof oldVal !== 'object') {
            // Treat empty strings and undefined as equal 'N/A'
            const safeOld = oldVal || 'N/A';
            const safeNew = newVal || 'N/A';
            
            if (safeOld !== safeNew) {
              // Format camelCase key into readable text (e.g. "email" -> "Email", "mobileNumber" -> "Mobile Number")
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              changes.push(`${formattedKey} changed to '${safeNew}'`);
            }
          }
        }
        
        if (changes.length > 0) {
          diffString = changes.join(' | ');
        } else {
          diffString = 'No primary fields were changed.';
        }
      }

      const updateData = { ...profile };
      delete updateData.id;
      const sanitizedData = JSON.parse(JSON.stringify(updateData));
      
      await setDoc(docRef, sanitizedData, { merge: true });
      
      await logSystemEvent(
        'Candidate Profile Updated',
        diffString,
        'UPDATE',
        docId
      );
    } else {
      // Create new document
      const docData = {
        ...profile,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
      docId = docRef.id;

      await logSystemEvent(
        'Candidate Profile Saved',
        `Data: ${detailedData}`,
        'CREATE',
        docId
      );
    }

    return docId;
  } catch (error) {
    console.error("Error saving candidate: ", error);
    throw error;
  }
};

/**
 * Deletes a candidate profile from Firestore
 */
export const deleteCandidateFromDb = async (candidateId: string): Promise<void> => {
  try {
    const { deleteDoc, doc } = await import('firebase/firestore');
    const docRef = doc(db, COLLECTION_NAME, candidateId);
    await deleteDoc(docRef);
    
    await logSystemEvent(
      'Candidate Profile Deleted',
      'Candidate record permanently deleted',
      'DELETE',
      candidateId
    );
  } catch (error) {
    console.error("Error deleting candidate: ", error);
    throw error;
  }
};

/**
 * Fetches all candidate profiles from Firestore
 */
export const getCandidatesFromDb = async (): Promise<CandidateProfile[]> => {
  try {
    // Fetch candidates ordered by newest first
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const candidates: CandidateProfile[] = [];
    querySnapshot.forEach((doc) => {
      // Cast the data back to CandidateProfile. 
      // Important: Put id: doc.id LAST so it overwrites any embedded 'id' field in the data!
      candidates.push({ ...doc.data(), id: doc.id } as CandidateProfile);
    });
    
    return candidates;
  } catch (error) {
    console.error("Error fetching candidates: ", error);
    // If it fails (e.g. permission issues or no connection), return an empty array
    return [];
  }
};

/**
 * Fetches all system logs from Firestore
 */
export const getSystemLogs = async (): Promise<SystemLog[]> => {
  try {
    // Fetch logs ordered by newest first
    const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const logs: SystemLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as SystemLog);
    });
    
    return logs;
  } catch (error) {
    console.error("Error fetching system logs: ", error);
    return [];
  }
};

/**
 * Fetches logs specific to a single candidate
 */
export const getCandidateLogs = async (candidateId: string): Promise<SystemLog[]> => {
  try {
    // Note: Not using orderBy here to avoid requiring a composite index in Firestore
    const q = query(
      collection(db, LOGS_COLLECTION),
      where('candidateId', '==', candidateId)
    );
    const querySnapshot = await getDocs(q);
    
    const logs: SystemLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as SystemLog);
    });
    
    // Sort descending by timestamp in memory
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error(`Error fetching logs for candidate ${candidateId}: `, error);
    return [];
  }
};
