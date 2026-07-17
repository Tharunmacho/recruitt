const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");

// Listen for any new document added to the portal_candidates collection
exports.logNewCandidate = onDocumentCreated("portal_candidates/{candidateId}", (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.log("No data associated with the event");
        return;
    }

    const data = snapshot.data();
    
    // Log the event beautifully to the backend
    logger.info("🎉 NEW CANDIDATE PORTAL SUBMISSION 🎉", {
        structuredData: true,
        candidateName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || 'N/A',
        expectedCTC: data.expectedCTC || 'N/A',
        role: data.currentDesignation || 'N/A',
        submissionTime: new Date().toISOString()
    });

    logger.info(`Successfully processed dossier for ${data.firstName || 'Candidate'}.`);
});
