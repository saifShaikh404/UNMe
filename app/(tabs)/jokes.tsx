import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createBoxyStyle } from '@/utils/boxy-styles';
import { getApiUrl, API_CONFIG, getJokeUrl, getJokeFavoriteUrl } from '@/config/api';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Joke = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: number;
  isFavorite: number;
  categoryID: string[];
  createdAt: string;
  __v: number;
};

type JokesResponse = {
  status: number;
  message: string;
  data: {
    jokes: Joke[];
    total: number;
    page: number;
  };
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type CategoriesResponse = {
  status: number;
  message: string;
  data: {
    categories: Category[];
  };
};

export default function JokesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];

  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalJokes, setTotalJokes] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingJoke, setViewingJoke] = useState<Joke | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchJokes = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (loading || isLoadingMore) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const limit = 10;
      const skip = (pageNum - 1) * limit;
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.JOKES)}?page=${pageNum}&limit=${limit}&skip=${skip}`;

      const response = await fetch(url);
      const data: JokesResponse = await response.json();

      if (response.ok && data.status === 200) {
        if (isRefresh || pageNum === 1) {
          setJokes(data.data.jokes);
        } else {
          setJokes((prev) => [...prev, ...data.data.jokes]);
        }

        // Store total jokes count
        setTotalJokes(data.data.total);

        // Check if there are more pages
        const totalPages = Math.ceil(data.data.total / limit);
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } else {
        throw new Error(data.message || 'Failed to fetch jokes');
      }
    } catch (error: any) {
      console.error('Error fetching jokes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore]);

  const fetchCategories = useCallback(async () => {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES);
      const response = await fetch(url);
      const data: CategoriesResponse = await response.json();

      if (response.ok && data.status === 200) {
        setCategories(data.data.categories);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchJokes(1);
    fetchCategories();
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !loading) {
      fetchJokes(page + 1);
    }
  }, [page, hasMore, isLoadingMore, loading, fetchJokes]);

  const handleRefresh = useCallback(() => {
    fetchJokes(1, true);
  }, [fetchJokes]);

  const handleDeleteJoke = async (joke: Joke) => {
    try {
      setDeletingId(joke._id);
      const url = getJokeUrl(joke._id);
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        // Refresh the jokes list
        await fetchJokes(1, true);
        Alert.alert('Success', 'Joke deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete joke');
      }
    } catch (error: any) {
      console.error('Error deleting joke:', error);
      Alert.alert('Error', error.message || 'Failed to delete joke. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (joke: Joke) => {
    try {
      // Toggle the favorite status: if current isFavorite is 1, pass 0; if 0, pass 1
      const newFavoriteStatus = joke.isFavorite === 1 ? 0 : 1;
      
      const url = getJokeFavoriteUrl(joke._id);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: newFavoriteStatus,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        // Refresh the jokes list
        await fetchJokes(1, true);
      } else {
        throw new Error(data.message || 'Failed to update favorite status');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', error.message || 'Failed to update favorite status. Please try again.');
    }
  };

  const handleJokeAction = (action: string, joke: Joke) => {
    switch (action) {
      case 'View':
        setViewingJoke(joke);
        break;
      case 'Edit':
        router.push(`/edit-joke?id=${joke._id}` as any);
        break;
      case 'Delete':
        Alert.alert(
          'Delete Joke',
          `Are you sure you want to delete "${joke.name}"? This action cannot be undone.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => handleDeleteJoke(joke),
            },
          ]
        );
        break;
      case 'Favourite':
        handleToggleFavorite(joke);
        break;
    }
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? colors.success : colors.icon;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getCategoryNames = (categoryIDs: string[]): string => {
    if (!categoryIDs || categoryIDs.length === 0) {
      return 'No categories';
    }
    
    const categoryNames = categoryIDs
      .map((id) => {
        const category = categories.find((cat) => cat._id === id);
        return category ? category.name : null;
      })
      .filter(Boolean) as string[];

    if (categoryNames.length === 0) {
      return 'No categories';
    }

    return categoryNames.join(', ');
  };

  if (loading && jokes.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading jokes...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 200;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
          if (isCloseToBottom && hasMore && !isLoadingMore && !loading) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}>
        {/* Total Jokes Heading */}
        <View style={[styles.totalJokesContainer, createBoxyStyle(colors.cardBackground, colors.borderBottom, colors.borderRight, 8, colors.borderTop, colors.borderLeft)]}>
          <ThemedText type="title" style={[styles.totalJokesHeading, { color: colors.text }]}>
            Total Jokes
          </ThemedText>
          <View style={[styles.totalJokesBadge, createBoxyStyle(colors.primary, colors.borderDark, colors.borderDark, 6, colors.borderTop, colors.borderLeft)]}>
            <Text style={styles.totalJokesCount}>{totalJokes}</Text>
          </View>
        </View>

        {jokes.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No jokes found</Text>
          </View>
        ) : (
          jokes.map((joke) => {
            const menuItems = [
              {
                label: 'View',
                onPress: () => handleJokeAction('View', joke),
              },
              {
                label: 'Edit',
                onPress: () => handleJokeAction('Edit', joke),
              },
              {
                label: 'Delete',
                onPress: () => handleJokeAction('Delete', joke),
              },
              // Only show Favourite option if joke is not already favorited
              ...(joke.isFavorite !== 1
                ? [
                    {
                      label: 'Favourite',
                      onPress: () => handleJokeAction('Favourite', joke),
                    },
                  ]
                : []),
            ];

            return (
              <View
                key={joke._id}
                style={[
                  styles.jokeCard,
                  createBoxyStyle(colors.cardBackground, colors.borderBottom, colors.borderRight, 8, colors.borderTop, colors.borderLeft),
                ]}>
                <View style={styles.jokeInfo}>
                  <View style={styles.jokeHeader}>
                    <Text style={[styles.jokeName, { color: colors.text }]}>{joke.name || 'Unknown'}</Text>
                    {joke.isFavorite === 1 && (
                      <Text style={styles.favoriteIcon}>⭐</Text>
                    )}
                  </View>
                  <Text style={[styles.jokeDescription, { color: colors.icon }]} numberOfLines={2}>
                    {joke.description || 'No description'}
                  </Text>
                  <View style={styles.jokeDetails}>
                    <Text style={[styles.jokeDetail, { color: getStatusColor(joke.status) }]}>
                      {getStatusText(joke.status)}
                    </Text>
                    {joke.categoryID && joke.categoryID.length > 0 && (
                      <Text style={[styles.jokeDetail, { color: colors.icon }]}>
                        {joke.categoryID.length} {joke.categoryID.length === 1 ? 'category' : 'categories'}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.actionContainer}>
                  <DropdownMenu
                    items={menuItems}
                    position="bottom-right"
                    trigger={
                      <View style={[styles.actionButton, createBoxyStyle(colors.accentLight, colors.borderBottom, colors.borderRight, 6, colors.borderTop, colors.borderLeft)]}>
                        <IconSymbol name="ellipsis" size={20} color={colors.primary} />
                      </View>
                    }
                  />
                </View>
              </View>
            );
          })
        )}

        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingMoreText, { color: colors.icon }]}>Loading more...</Text>
          </View>
        )}

        {!hasMore && jokes.length > 0 && (
          <View style={styles.endContainer}>
            <Text style={[styles.endText, { color: colors.icon }]}>No more jokes to load</Text>
          </View>
        )}
      </ScrollView>

      {/* View Joke Modal */}
      <Modal
        visible={viewingJoke !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingJoke(null)}>
        <TouchableWithoutFeedback onPress={() => setViewingJoke(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  createBoxyStyle(
                    colors.cardBackground,
                    colors.borderBottom,
                    colors.borderRight,
                    12,
                    colors.borderTop,
                    colors.borderLeft
                  ),
                ]}>
                {viewingJoke && (
                  <>
                    <View style={styles.modalHeader}>
                      <ThemedText type="title" style={[styles.modalTitle, { color: colors.text }]}>
                        Joke Details
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => setViewingJoke(null)}
                        style={styles.closeButton}>
                        <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                      <View style={styles.modalBody}>
                        {/* Name */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Name</Text>
                          <Text style={[styles.modalValue, { color: colors.text }]}>
                            {viewingJoke.name || 'N/A'}
                          </Text>
                        </View>

                        {/* Description */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Description</Text>
                          <Text style={[styles.modalValue, styles.modalDescription, { color: colors.text }]}>
                            {viewingJoke.description || 'No description'}
                          </Text>
                        </View>

                        {/* Status */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Status</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              createBoxyStyle(
                                viewingJoke.status === 1 ? colors.success : colors.icon,
                                colors.borderDark,
                                colors.borderDark,
                                6,
                                colors.borderTop,
                                colors.borderLeft
                              ),
                            ]}>
                            <Text style={styles.statusBadgeText}>
                              {getStatusText(viewingJoke.status)}
                            </Text>
                          </View>
                        </View>

                        {/* Favorite */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Favorite</Text>
                          <Text style={[styles.modalValue, { color: colors.text }]}>
                            {viewingJoke.isFavorite === 1 ? '⭐ Yes' : 'No'}
                          </Text>
                        </View>

                        {/* Categories */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Categories</Text>
                          <Text style={[styles.modalValue, { color: colors.text }]}>
                            {getCategoryNames(viewingJoke.categoryID || [])}
                          </Text>
                        </View>

                        {/* Slug */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Slug</Text>
                          <Text style={[styles.modalValue, { color: colors.text }]}>
                            {viewingJoke.slug || 'N/A'}
                          </Text>
                        </View>

                        {/* Created At */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>Created At</Text>
                          <Text style={[styles.modalValue, { color: colors.text }]}>
                            {viewingJoke.createdAt ? formatDate(viewingJoke.createdAt) : 'N/A'}
                          </Text>
                        </View>

                        {/* ID */}
                        <View style={styles.modalField}>
                          <Text style={[styles.modalLabel, { color: colors.icon }]}>ID</Text>
                          <Text style={[styles.modalValue, styles.modalId, { color: colors.icon }]}>
                            {viewingJoke._id}
                          </Text>
                        </View>
                      </View>
                    </ScrollView>
                    <TouchableOpacity
                      style={[
                        styles.modalCloseButton,
                        createBoxyStyle(
                          colors.primary,
                          colors.borderDark,
                          colors.borderDark,
                          8,
                          colors.borderTop,
                          colors.borderLeft
                        ),
                      ]}
                      onPress={() => setViewingJoke(null)}>
                      <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 16,
  },
  totalJokesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  totalJokesHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  totalJokesBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalJokesCount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  jokeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  jokeInfo: {
    flex: 1,
    marginRight: 12,
  },
  jokeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  jokeName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  jokeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
  },
  jokeDetails: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  jokeDetail: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
  },
  endContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 14,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalBody: {
    gap: 16,
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  modalDescription: {
    lineHeight: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalId: {
    fontSize: 12,
    fontFamily: 'monospace',
    opacity: 0.7,
  },
  modalCloseButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
