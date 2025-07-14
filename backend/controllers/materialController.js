const Material = require('../models/Material');
const Community = require('../models/Community');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // Import child_process

// Upload new material
exports.uploadMaterial = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, communityId, tags } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const originalFileName = req.file.originalname;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    console.log(`Debug: Uploaded file path (req.file.path) = ${req.file.path}`);
    console.log(`Debug: Storing fileUrl in DB = ${fileUrl}`);
    
    // Determine file type and MIME type
    let fileType = 'document'; // Default to a generic document type
    let mimeType = 'application/octet-stream'; // Default to a generic binary stream

    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(fileExtension)) {
      fileType = 'image';
      mimeType = `image/${fileExtension.substring(1)}`;
    } else if (['.mp4', '.webm', '.avi', '.mov'].includes(fileExtension)) {
      fileType = 'video';
      mimeType = `video/${fileExtension.substring(1)}`;
    } else if (['.mp3', '.wav', '.ogg'].includes(fileExtension)) {
      fileType = 'audio';
      mimeType = `audio/${fileExtension.substring(1)}`;
    } else if (['.pdf'].includes(fileExtension)) {
      fileType = 'pdf';
      mimeType = 'application/pdf';
    } else if (['.txt', '.log', '.md'].includes(fileExtension)) {
      fileType = 'text';
      mimeType = 'text/plain';
    } else if (['.doc', '.docx'].includes(fileExtension)) {
      fileType = 'word';
      mimeType = 'application/msword'; // For .doc
      if (fileExtension === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (['.xls', '.xlsx'].includes(fileExtension)) {
      fileType = 'excel';
      mimeType = 'application/vnd.ms-excel'; // For .xls
      if (fileExtension === '.xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (['.ppt', '.pptx'].includes(fileExtension)) {
      fileType = 'powerpoint';
      mimeType = 'application/vnd.ms-powerpoint'; // For .ppt
      if (fileExtension === '.pptx') mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    }

    // Check if community exists and user is a member
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Verify user belongs to community
    const isMember = 
      community.admin.toString() === userId ||
      community.teachers.some(teacherId => teacherId.toString() === userId) ||
      community.students.some(studentId => studentId.toString() === userId);
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this community' });
    }

    // Process tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    // Create new material
    const newMaterial = new Material({
      title,
      description,
      fileUrl,
      originalFileName,
      fileType,
      mimeType,
      community: communityId,
      author: userId,
      authorRole: userRole,
      tags: tagArray
    });

    await newMaterial.save();

    // Add material to community
    await Community.findByIdAndUpdate(
      communityId,
      { $push: { materials: newMaterial._id } }
    );

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get materials by community
exports.getMaterialsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    
    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Verify user belongs to community
    const userId = req.user.id;
    const isMember = 
      community.admin.toString() === userId ||
      community.teachers.some(teacherId => teacherId.toString() === userId) ||
      community.students.some(studentId => studentId.toString() === userId);
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this community' });
    }

    // Get materials
    const materials = await Material.find({ community: communityId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete material (admin or author)
exports.deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    
    // Find material
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user is admin or author
    const userId = req.user.id;
    const userRole = req.user.role;
    const isAdmin = userRole === 'admin';
    const isAuthor = material.author.toString() === userId;
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'You are not authorized to delete this material' });
    }

    // Delete file from uploads folder
    const filePath = path.join(__dirname, '..', material.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove material from community
    await Community.findByIdAndUpdate(
      material.community,
      { $pull: { materials: materialId } }
    );

    // Delete material
    await Material.findByIdAndDelete(materialId);

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search materials within a community
exports.searchMaterials = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Verify user belongs to community
    const userId = req.user.id;
    const isMember = 
      community.admin.toString() === userId ||
      community.teachers.some(teacherId => teacherId.toString() === userId) ||
      community.students.some(studentId => studentId.toString() === userId);
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this community' });
    }

    // Search materials
    const materials = await Material.find({
      community: communityId,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ]
    })
    .populate('author', 'name')
    .sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    console.error('Search materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download a material file
exports.downloadMaterial = async (req, res) => {
  console.log('Debug: Entering downloadMaterial function.');
  try {
    const { materialId } = req.params;
    const { view } = req.query; // Get the 'view' query parameter
    console.log(`Debug: Received 'view' query parameter: ${view}`);
    console.log(`Debug: Type of 'view' query parameter: ${typeof view}`);

    const material = await Material.findById(materialId);
    if (!material) {
      console.log(`Debug: Material with ID ${materialId} not found.`);
      return res.status(404).json({ message: 'Material not found' });
    }

    // Verify user belongs to community before allowing download/view
    const community = await Community.findById(material.community);
    if (!community) {
      console.log(`Debug: Community with ID ${material.community} not found for material ${materialId}.`);
      return res.status(404).json({ message: 'Community not found for this material' });
    }

    const userId = req.user.id;
    const isMember =
      community.admin.toString() === userId ||
      community.teachers.some(teacherId => teacherId.toString() === userId) ||
      community.students.some(studentId => studentId.toString() === userId);

    if (!isMember) {
      console.log(`Debug: User ${userId} is not a member of community ${community._id}.`);
      return res.status(403).json({ message: 'You are not a member of this community and cannot access this material' });
    }

    const originalFilePath = path.join(__dirname, '..', material.fileUrl);
    console.log(`Debug: material.fileUrl = ${material.fileUrl}`);
    console.log(`Debug: Constructed originalFilePath = ${originalFilePath}`);
    console.log(`Debug: Checking if original file exists at: ${originalFilePath}`);
    const originalFileExists = fs.existsSync(originalFilePath);
    console.log(`Debug: fs.existsSync(${originalFilePath}) returned: ${originalFileExists}`);

    if (!originalFileExists) {
      console.log(`Debug: Original file DOES NOT exist at path: ${originalFilePath}.`);
      return res.status(404).json({ message: 'File not found on server' });
    }

    let filePathToServe = originalFilePath;
    let mimeTypeToServe = material.mimeType || 'application/octet-stream';
    let dispositionToServe = view === 'true' ? 'inline' : 'attachment';
    let fileNameToServe = material.originalFileName;

    // Handle conversion for viewing non-native browser documents
    if (view === 'true' && ['word', 'excel', 'powerpoint'].includes(material.fileType)) {
      const tempPdfDir = path.join(__dirname, '..' , 'temp_pdfs');
      if (!fs.existsSync(tempPdfDir)) {
        fs.mkdirSync(tempPdfDir, { recursive: true });
      }

      const pdfFileName = `${path.basename(material.originalFileName, path.extname(material.originalFileName))}.pdf`;
      const tempPdfPath = path.join(tempPdfDir, pdfFileName);

      console.log(`Debug: Attempting to convert ${material.originalFileName} to PDF for viewing.`);
      console.log(`Debug: Temp PDF path: ${tempPdfPath}`);

      try {
        // Adjust LibreOffice path as needed for your system
        const libreOfficeCommand = process.platform === 'win32'
        ? `"D:\\\\Apps\\\\LibreOffice\\\\program\\\\soffice.exe" --headless --convert-to pdf --outdir "${tempPdfDir}" "${originalFilePath}"`
        : `soffice --headless --convert-to pdf --outdir "${tempPdfDir}" "${originalFilePath}"`;
        
        await new Promise((resolve, reject) => {
          exec(libreOfficeCommand, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return reject(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
          });
        });

        if (!fs.existsSync(tempPdfPath)) {
          throw new Error('PDF conversion failed: Output file not found.');
        }

        filePathToServe = tempPdfPath;
        mimeTypeToServe = 'application/pdf';
        fileNameToServe = pdfFileName; // Use the PDF filename
        console.log(`Debug: Converted to PDF successfully. Serving: ${filePathToServe}`);

      } catch (conversionError) {
        console.error('Error during document conversion to PDF:', conversionError);
        // Fallback to downloading original if conversion fails
        console.log('Debug: Falling back to downloading original file due to conversion error.');
        dispositionToServe = 'attachment';
        filePathToServe = originalFilePath;
        mimeTypeToServe = material.mimeType || 'application/octet-stream';
      }
    }

    res.setHeader('Content-Disposition', `${dispositionToServe}; filename="${fileNameToServe}"`);
    res.setHeader('Content-Type', mimeTypeToServe);
    console.log(`Debug: Final Content-Disposition header set to: ${dispositionToServe}; filename="${fileNameToServe}"`);
    console.log(`Debug: Final Content-Type header set to: ${mimeTypeToServe}`);
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePathToServe);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });

    // Clean up temporary PDF file after streaming is complete
    res.on('finish', () => {
      if (filePathToServe !== originalFilePath && fs.existsSync(filePathToServe)) {
        fs.unlink(filePathToServe, (err) => {
          if (err) console.error('Error deleting temporary PDF file:', err);
          else console.log(`Debug: Deleted temporary PDF file: ${filePathToServe}`);
        });
      }
    });

  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 