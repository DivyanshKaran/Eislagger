import { Router } from "express";
import {
  getConversations,
  createConversation,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  getOnlineUsers,
  getAllEmails,
  sendEmail,
  getEmail,
  markEmailAsRead,
  starEmail,
  replyToEmail,
  getNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  handleChatAttachmentUpload,
} from "../controllers/communications.controller.ts";
import { isAuthenticated, optionalAuth } from "../middleware/auth.ts";
import { chatAttachmentUpload } from "../middleware/fileUpload.ts";

const router = Router();

// --- Chat routes ---
router.get("/chat/conversations", isAuthenticated, getConversations);
router.post("/chat/conversations", isAuthenticated, createConversation);
router.get("/chat/conversations/:id/messages", isAuthenticated, getConversationMessages);
router.post("/chat/conversations/:id/messages", isAuthenticated, sendMessage);
router.post("/chat/messages/:id/read", isAuthenticated, markMessageAsRead);
router.get("/chat/online-users", optionalAuth, getOnlineUsers);

// --- Email routes ---
router.get("/emails", isAuthenticated, getAllEmails);
router.post("/emails", isAuthenticated, sendEmail);
router.get("/emails/:id", isAuthenticated, getEmail);
router.put("/emails/:id/read", isAuthenticated, markEmailAsRead);
router.put("/emails/:id/star", isAuthenticated, starEmail);
router.post("/emails/:id/reply", isAuthenticated, replyToEmail);

// --- Notification routes ---
router.get("/notifications", isAuthenticated, getNotifications);
router.post("/notifications", isAuthenticated, createNotification);
router.put("/notifications/:id/read", isAuthenticated, markNotificationAsRead);
router.delete("/notifications/:id", isAuthenticated, deleteNotification);
router.post("/notifications/mark-all", isAuthenticated, markAllNotificationsAsRead);

// --- Upload routes ---
router.post(
  "/upload/chat-attachments",
  isAuthenticated,
  chatAttachmentUpload,
  handleChatAttachmentUpload
);

export default router;


