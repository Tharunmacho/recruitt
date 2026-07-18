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
 * Uploads physical files to the local Express backend server.
 * Returns the DocumentUpload objects but with their `url` set and `base64/file` stripped to save DB space.
 */
export const uploadCandidateFiles = async (
  candidateName: string, 
  docsToUpload: { field: string, doc: any }[]
): Promise<any[]> => {
  if (docsToUpload.length === 0) return [];
  
  const formData = new FormData();
  
  docsToUpload.forEach(item => {
    formData.append(item.field, item.doc.file);
  });
  
  const safeName = candidateName || 'Unknown_Candidate';
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4005';
    const response = await fetch(`${apiUrl}/api/upload/${encodeURIComponent(safeName)}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.files.map((fileRes: any) => {
      return {
        field: fileRes.fieldname,
        doc: {
          name: fileRes.originalName,
          size: `${(fileRes.size / 1024).toFixed(0)} KB`,
          uploadedAt: new Date().toISOString().split('T')[0],
          url: fileRes.url
        }
      };
    });
  } catch (error) {
    console.error('Failed to upload files to backend:', error);
    throw error;
  }
};

/**
 * Orchestrates the full process of extracting files from a profile, uploading them,
 * sanitizing the profile object, and saving it to Firestore.
 */
export const submitCandidateProfile = async (profile: CandidateProfile): Promise<void> => {
  const docsToUpload: { field: string, doc: any }[] = [];
  const documentFields = [
    'passport', 'resume', 'educationCertificate', 'expertiseCertificates'
  ];
  
  documentFields.forEach(field => {
    const docObj = (profile as any)[field];
    if (docObj) {
      let validFile = null;
      if (docObj.file instanceof File || docObj.file instanceof Blob) {
        validFile = docObj.file;
      } else if (docObj.base64 && typeof docObj.base64 === 'string') {
        try {
          const mime = docObj.base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'application/octet-stream';
          const b64Data = docObj.base64.split(',')[1];
          if (b64Data) {
            const byteString = atob(b64Data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            validFile = new File([ab], docObj.name || 'document', { type: mime });
          }
        } catch (e) {
          console.warn('Failed to reconstruct file from base64 for', field);
        }
      }
      
      if (validFile) {
        docsToUpload.push({ field, doc: { ...docObj, file: validFile } });
      }
    }
  });

  const folderName = `${profile.candidateName}_${profile.contactNumber}`;
  const uploadedDocs = await uploadCandidateFiles(folderName, docsToUpload);
  
  const profileToSave = JSON.parse(JSON.stringify(profile));
  
  // Apply any freshly uploaded document properties to the profile
  uploadedDocs.forEach(uploadedDoc => {
    (profileToSave as any)[uploadedDoc.field] = uploadedDoc.doc;
  });

  // Strip complex objects before saving to DB
  documentFields.forEach(field => {
    const doc = (profileToSave as any)[field];
    if (doc && typeof doc === 'object') {
      delete doc.file;
      delete doc.base64;
    }
  });

  await saveCandidateToDb(profileToSave);
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
      `Name: ${profile.candidateName}`,
      `Contact: ${profile.contactNumber}`,
      `Designation: ${profile.designation || 'N/A'}`,
      `Industry: ${profile.industry || 'N/A'}`,
      `Passport: ${profile.passportNumber || 'No'}`,
      `Experience: ${profile.totalExperience || 'N/A'}`
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
          
          // Compare simple text/number/boolean fields directly
          if (typeof newVal !== 'object' && typeof oldVal !== 'object') {
            // Treat empty strings and undefined as equal 'N/A'
            const safeOld = oldVal || 'N/A';
            const safeNew = newVal || 'N/A';
            
            if (safeOld !== safeNew) {
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              changes.push(`${formattedKey} changed to '${safeNew}'`);
            }
          } else {
            // For arrays (lists)
            if (Array.isArray(newVal) || Array.isArray(oldVal)) {
              const oldArr = Array.isArray(oldVal) ? oldVal : [];
              const newArr = Array.isArray(newVal) ? newVal : [];
              if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                changes.push(`${formattedKey} list was updated (${newArr.length} items)`);
              }
            } 
            // For Document Uploads (objects with name, size, url)
            else if ((newVal && typeof newVal === 'object') || (oldVal && typeof oldVal === 'object')) {
              const oldDoc = oldVal || {};
              const newDoc = newVal || {};
              
              // We only care if the actual file identity changed (ignoring base64/file properties that may have been stripped)
              if (oldDoc.name !== newDoc.name || oldDoc.url !== newDoc.url || oldDoc.size !== newDoc.size) {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                changes.push(`${formattedKey} document was updated`);
              }
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
