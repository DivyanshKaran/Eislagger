import multer from "multer";
import path from "path";
import type { Request, Response, NextFunction } from "express";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on route
    let uploadPath: string;
    
    if (req.path.includes('chat-attachments')) {
      uploadPath = 'uploads/chat-attachments';
    } else if (req.path.includes('profile-images')) {
      uploadPath = 'uploads/profile-images';
    } else {
      uploadPath = 'uploads/misc';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for security
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed file types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    'text/plain',
    'text/csv',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    
    // Video
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Configure multer with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Max 10 files per request
    fieldSize: 1024 * 1024 * 10, // 10MB field size limit
    fieldNameSize: 100,
  },
});

// Error handler for multer
const errorHandler = (
  error: multer.MulterError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: "File size exceeds 50MB limit"
          }
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          error: {
            code: "TOO_MANY_FILES",
            message: "Too many files uploaded. Maximum 10 files allowed"
          }
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          error: {
            code: "UNEXPECTED_FILE",
            message: "Unexpected file field"
          }
        });
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: "UPLOAD_ERROR",
            message: error.message
          }
        });
    }
  }
  
  if (error.message.includes("File type") && error.message.includes("not allowed")) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_FILE_TYPE",
        message: error.message
      }
    });
  }

  next(error);
};

// Setup middleware
export const setupFileUploadMiddleware = () => {
  return [
    // Handle single file uploads
    upload.single('file'),
    
    // Handle multiple file uploads
    upload.array('files', 10),
    
    // Handle specific fields
    upload.fields([
      { name: 'attachment', maxCount: 1 },
      { name: 'image', maxCount: 1 },
      { name: 'document', maxCount: 5 }
    ]),
    
    // Error handler
    errorHandler
  ];
};

// Individual upload handlers
export const singleFileUpload = upload.single('file');
export const multipleFileUpload = upload.array('files', 10);
export const chatAttachmentUpload = upload.single('attachment');

export default {
  setupFileUploadMiddleware,
  singleFileUpload,
  multipleFileUpload,
  chatAttachmentUpload,
};

