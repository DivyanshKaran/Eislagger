// Message hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { messageKeys } from '@/services/queryKeys';
import type { 
  GetMessagesRequest,
  SendMessageRequest
} from '@/types/api/index';
import type { Message, User } from '@/types/models';

// ============================================================================
// MESSAGE QUERIES
// ============================================================================

// Get conversations/messages
export function useMessages(params?: GetMessagesRequest) {
  const defaultParams: GetMessagesRequest = { page: 1, limit: 50, ...(params || {}) } as GetMessagesRequest;
  return useQuery({
    queryKey: messageKeys.list(defaultParams),
    queryFn: async () => {
      const response = await dataService.message.getMessages(defaultParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch messages');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
}

// Get conversation messages
export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: messageKeys.conversation(conversationId),
    queryFn: async () => {
      const response = await dataService.message.getConversationMessages(conversationId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch conversation messages');
      }
      return response.data;
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for real-time updates
  });
}

// Get online users
export function useOnlineUsers() {
  return useQuery({
    queryKey: messageKeys.onlineUsers(),
    queryFn: async () => {
      const response = await dataService.message.getOnlineUsers();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch online users');
      }
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });
}

// ============================================================================
// MESSAGE MUTATIONS
// ============================================================================

// Send message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId: string; data: SendMessageRequest }) => {
      const response = await dataService.message.sendMessage(conversationId, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate conversation messages
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(variables.conversationId) });
      
      // Invalidate messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    },
    onError: (error) => {
      console.error('Send message failed:', error);
    },
  });
}

// Mark message as read
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await dataService.message.markMessageAsRead(messageId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark message as read');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    },
    onError: (error) => {
      console.error('Mark message as read failed:', error);
    },
  });
}

// ============================================================================
// MESSAGE UTILITIES
// ============================================================================

// Get unread message count
export function useUnreadMessageCount() {
  const { data: messagesResponse } = useMessages({ page: 1, limit: 1000 } as GetMessagesRequest);
  
  const unreadCount = messagesResponse?.data?.filter(message => !message.read).length || 0;
  
  return {
    unreadCount,
    isLoading: !messagesResponse,
  };
}

// Get recent conversations
export function useRecentConversations(limit: number = 10) {
  return useMessages({ 
    page: 1,
    limit, 
    sortBy: 'updatedAt', 
    sortOrder: 'desc' 
  });
}

// Get conversation by ID
export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: messageKeys.detail(conversationId),
    queryFn: async () => {
      const response = await dataService.message.getMessages({ 
        conversationId,
        page: 1,
        limit: 1 
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch conversation');
      }
      return response.data.data[0] || null;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Search messages
export function useSearchMessages(searchTerm: string) {
  // Backend GetMessagesRequest lacks 'search'; fetch page and filter client-side
  const { data } = useMessages({ page: 1, limit: 200 } as GetMessagesRequest);
  const results = data?.data?.filter(m => m.text?.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  return { data: { data: results }, isLoading: !data, error: undefined as any };
}

// Get message statistics
export function useMessageStats() {
  return useQuery({
    queryKey: [...messageKeys.all, 'stats'],
    queryFn: async () => {
      const response = await dataService.message.getMessages({ page: 1, limit: 1000 } as GetMessagesRequest);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch message stats');
      }
      
      const messages = response.data.data;
      const totalMessages = messages.length;
      const unreadMessages = messages.filter(message => !message.read).length;
      const todayMessages = messages.filter(message => {
        const messageDate = new Date(message.createdAt);
        const today = new Date();
        return messageDate.toDateString() === today.toDateString();
      }).length;
      
      return {
        totalMessages,
        unreadMessages,
        todayMessages,
        averagePerDay: Math.round(totalMessages / 30), // Assuming 30 days
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get active conversations
export function useActiveConversations() {
  return useQuery({
    queryKey: [...messageKeys.all, 'active'],
    queryFn: async () => {
      const response = await dataService.message.getMessages({ 
        page: 1,
        limit: 100,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active conversations');
      }
      
      // Group messages by conversation
      const conversations = new Map();
      response.data.data.forEach(message => {
        const convId = (message as any).conversationId;
        if (!conversations.has(convId)) {
          conversations.set(convId, {
            id: convId,
            lastMessage: message,
            unreadCount: 0,
            participants: [],
          });
        }
        
        const conv = conversations.get(convId);
        if (!conv.lastMessage || new Date(message.createdAt) > new Date(conv.lastMessage.createdAt)) {
          conv.lastMessage = message;
        }
        
        if (!message.read) {
          conv.unreadCount++;
        }
      });
      
      return Array.from(conversations.values());
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Get conversation participants
export function useConversationParticipants(conversationId: string) {
  return useQuery({
    queryKey: [...messageKeys.conversation(conversationId), 'participants'],
    queryFn: async () => {
      // This would typically come from a specific endpoint
      // For now, we'll return mock data
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'clerk',
          isOnline: true,
          lastSeen: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'patron',
          isOnline: false,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      ];
    },
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
