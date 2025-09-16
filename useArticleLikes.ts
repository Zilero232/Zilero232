import { useCallback, useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ArticleService } from '@/services/article.service';

import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage';

const LIKED_ARTICLES_KEY = 'likedArticles';

// Operation definitions
const operations = {
  like: {
    api: ArticleService.increaseArticleLike,
    countUpdate: (count: number) => count + 1,
    toastMessage: 'Спасибо за лайк!'
  },
  unlike: {
    api: ArticleService.decreaseArticleLike,
    countUpdate: (count: number) => Math.max(0, count - 1),
    toastMessage: 'Вы убрали свой лайк'
  }
} as const;

interface UseArticleLikesProps {
  articleId: string;
}

interface UseArticleLikesReturn {
  isLiked: boolean;
  isLoading: boolean;
  likesCount: number;
  toggleLike: () => Promise<void>;
}

export const useArticleLikes = ({ articleId }: UseArticleLikesProps): UseArticleLikesReturn => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = [`article-likes-${articleId}`];

  const { data: likesData, isLoading: isLoadingLikes } = useQuery({
    queryKey,
    queryFn: () => ArticleService.getArticleLikes(articleId),
    enabled: !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: { likes: 0 }
  });

  const likesCount = likesData?.likes ?? 0;

  const { value: likedArticles, set: setLikedArticles } = useLocalStorage<string[]>(LIKED_ARTICLES_KEY, []);

  // Initialize liked state from localStorage
  useEffect(() => {
    if (!articleId) return;
    
    setIsLiked(likedArticles.includes(articleId));
  }, [articleId, likedArticles]);

  const toggleLike = useCallback(async () => {
    if (isLoading || !articleId) return;

    const operation = operations[isLiked ? 'unlike' : 'like'];
    const previousLikesCount = likesCount;
    const previousIsLiked = isLiked;

    setIsLoading(true);

    // Optimistic update
    setIsLiked(!isLiked);
    queryClient.setQueryData(queryKey, {
      likes: operation.countUpdate(likesCount)
    });

    try {
      const response = await operation.api(articleId);

      if (!response || !('likes' in response) || typeof response.likes !== 'number') {
        throw new Error('Invalid response format');
      }

      // Update the query cache with the actual response
      queryClient.setQueryData(queryKey, { likes: response.likes });

      // Update localStorage
      setLikedArticles((prev) => {
        const updated = isLiked ? prev.filter((id) => id !== articleId) : [...prev, articleId];
        return updated;
      });

      // Show success toast
      toast.success(operation.toastMessage, {
        id: 'article-likes-toast'
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);

      // Revert optimistic updates
      setIsLiked(previousIsLiked);
      queryClient.setQueryData(queryKey, { likes: previousLikesCount });

      // Show error toast
      toast.error('Не удалось изменить статус лайка', {
        id: 'article-likes-toast'
      });
    } finally {
      setIsLoading(false);
    }
  }, [articleId, isLiked, likesCount, queryClient, queryKey, setLikedArticles]);

  return {
    likesCount,
    isLiked,
    isLoading: isLoading || isLoadingLikes,
    toggleLike
  };
};