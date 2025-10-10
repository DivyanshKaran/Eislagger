// Email hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { emailKeys } from '@/services/queryKeys';
import type { 
  GetEmailsRequest, 
  SendEmailRequest, 
  UpdateEmailRequest 
} from '@/types/api/index';
import type { Email } from '@/types/models';

// ============================================================================
// EMAIL QUERIES
// ============================================================================

// Get emails with pagination and filters
export function useEmails(params?: GetEmailsRequest) {
  const safeParams: GetEmailsRequest | undefined = params || { page: 1, limit: 50 } as GetEmailsRequest;
  return useQuery({
    queryKey: emailKeys.list(safeParams),
    queryFn: async () => {
      const response = await dataService.email.getEmails(safeParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch emails');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single email by ID
export function useEmail(id: string) {
  return useQuery({
    queryKey: emailKeys.detail(id),
    queryFn: async () => {
      const response = await dataService.email.getEmail(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch email');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// EMAIL MUTATIONS
// ============================================================================

// Send email mutation
export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendEmailRequest) => {
      const response = await dataService.email.sendEmail(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send email');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate emails list to refresh
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
    onError: (error) => {
      console.error('Send email failed:', error);
    },
  });
}

// Update email mutation (mark as read, star, etc.)
export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmailRequest }) => {
      const response = await dataService.email.updateEmail(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update email');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific email in cache
      queryClient.setQueryData(emailKeys.detail(variables.id), data);
      
      // Invalidate emails list
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
    onError: (error) => {
      console.error('Update email failed:', error);
    },
  });
}

// Mark email as read mutation
export function useMarkEmailAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.email.markEmailAsRead(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark email as read');
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update email in cache
      queryClient.setQueryData(emailKeys.detail(id), (old: Email) => 
        old ? { ...old, unread: false } : old
      );
      
      // Invalidate emails list
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
    onError: (error) => {
      console.error('Mark email as read failed:', error);
    },
  });
}

// Star/unstar email mutation
export function useStarEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.email.starEmail(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to star email');
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update email in cache
      queryClient.setQueryData(emailKeys.detail(id), (old: Email) => 
        old ? { ...old, starred: !old.starred } : old
      );
      
      // Invalidate emails list
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
    onError: (error) => {
      console.error('Star email failed:', error);
    },
  });
}

// Reply to email mutation
export function useReplyToEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await dataService.email.replyToEmail(id, content);
      if (!response.success) {
        throw new Error(response.error || 'Failed to reply to email');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate emails list to show the reply
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
    onError: (error) => {
      console.error('Reply to email failed:', error);
    },
  });
}

// ============================================================================
// EMAIL UTILITIES
// ============================================================================

// Get unread email count
export function useUnreadEmailCount() {
  const { data: emailsResponse } = useEmails({ page: 1, limit: 1000, unreadOnly: true });
  
  const unreadCount = emailsResponse?.data?.length || 0;
  
  return {
    unreadCount,
    isLoading: !emailsResponse,
  };
}

// Get emails by category
export function useEmailsByCategory(category: string) {
  return useEmails({ page: 1, folder: category as any, limit: 50 });
}

// Get starred emails
export function useStarredEmails() {
  // Backend request doesn't support starred filter; fetch and filter client-side
  const { data } = useEmails({ page: 1, limit: 200 });
  const starred = data?.data?.filter(e => e.starred) || [];
  return { data: { data: starred }, isLoading: !data, error: undefined as any };
}

// Search emails
export function useSearchEmails(searchTerm: string) {
  return useEmails({ 
    page: 1,
    search: searchTerm, 
    limit: 50 
  });
}
