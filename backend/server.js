const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

// Enable CORS for frontend requests
app.use(cors());

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const candidateName = req.params.candidateName;
    // Sanitize the candidate name to create a safe folder name
    const sanitizedName = candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const uploadPath = path.join(__dirname, 'uploads', sanitizedName);
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // Clean up existing file for this specific field to prevent orphans
    try {
      if (file.fieldname !== 'files') {
        const existingFiles = fs.readdirSync(uploadPath);
        for (const f of existingFiles) {
          if (f.startsWith(file.fieldname + '.')) {
            fs.unlinkSync(path.join(uploadPath, f));
            console.log(`[UPDATE] Deleted old file: ${f} for candidate ${sanitizedName}`);
          }
        }
      }
    } catch (e) {
      console.error('Error cleaning up existing file:', e);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (file.fieldname !== 'files') {
      // Use the explicit field name as the file name so it reliably overwrites on updates
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}${ext}`);
    } else {
      // Fallback for generic uploads
      const safeName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    }
  }
});

const upload = multer({ storage: storage });

// API endpoint to handle file uploads
// API endpoint to handle file uploads (supports dynamic field names for updates)
app.post('/api/upload/:candidateName', upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const candidateName = req.params.candidateName;
    const sanitizedName = candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Map the uploaded files to their accessible URLs
    const uploadedFiles = req.files.map(file => {
      // The URL will be /api/files/candidate_name/filename (relative path for Nginx routing)
      const fileUrl = `/api/files/${sanitizedName}/${file.filename}`;
      return {
        originalName: file.originalname,
        filename: file.filename,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
        fieldname: file.fieldname
      };
    });

    console.log(`[SUCCESS] Processed ${uploadedFiles.length} files for candidate: ${candidateName}`);

    res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Serve the uploads directory statically so frontend can access the files
// E.g., /api/files/tharun_macho_9003628412/16239123-resume.pdf
app.use('/api/files', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`🚀 File Server running on port ${PORT}`);
  console.log(`📁 Uploads will be saved to ${path.join(__dirname, 'uploads')}`);
  console.log(`========================================\n`);
});
