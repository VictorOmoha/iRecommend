// Mock data for i-Recommend app

export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjM5ODAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE2LjY4NiA1IDIwSDMuNUMzLjUgMTUuODU3OSA3LjM1Nzg2IDEyLjUgMTIgMTIuNUMxNi42NDIxIDEyLjUgMjAuNSAxNS44NTc5IDIwLjUgMjBIMTlDMTkgMTYuNjg2IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
    bio: 'Food lover & travel enthusiast 🍕✈️',
    follower_count: 1234,
    following_count: 456,
  },
  {
    id: '2',
    name: 'Alex Chen',
    username: 'alexc',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDdBRkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE2LjY4NiA1IDIwSDMuNUMzLjUgMTUuODU3OSA3LjM1Nzg2IDEyLjUgMTIgMTIuNUMxNi42NDIxIDEyLjUgMjAuNSAxNS44NTc5IDIwLjUgMjBIMTlDMTkgMTYuNjg2IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
    bio: 'Tech reviewer & gadget enthusiast 💻📱',
    follower_count: 892,
    following_count: 234,
  },
  {
    id: '3',
    name: 'Maria Garcia',
    username: 'mariag',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzNEM3NTkiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE2LjY4NiA1IDIwSDMuNUMzLjUgMTUuODU3OSA3LjM1Nzg2IDEyLjUgMTIgMTIuNUMxNi42NDIxIDEyLjUgMjAuNSAxNS44NTc5IDIwLjUgMjBIMTlDMTkgMTYuNjg2IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
    bio: 'Bookworm & coffee addict ☕📚',
    follower_count: 567,
    following_count: 123,
  },
];

export const mockRooms = [
  { id: '1', name: 'Food', color: '#FF6B6B', post_count: 15 },
  { id: '2', name: 'Tech', color: '#4ECDC4', post_count: 8 },
  { id: '3', name: 'Books', color: '#45B7D1', post_count: 12 },
  { id: '4', name: 'Travel', color: '#96CEB4', post_count: 6 },
  { id: '5', name: 'Movies', color: '#FFEAA7', post_count: 9 },
];

export const mockPosts = [
  {
    id: '1',
    title: 'Amazing Italian Restaurant in Downtown',
    description: 'Just discovered this hidden gem! The pasta is incredible and the atmosphere is perfect for a date night. Service was top-notch too.',
    media: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY2QjZCIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+🍝 Restaurant</text+Cjwvc3ZnPgo=',
    media_type: 'image',
    tags: ['italian', 'pasta', 'romantic'],
    external_link: 'https://example.com/restaurant',
    recommendation_type: 'recommend',
    action_type: 'buy',
    like_count: 42,
    comment_count: 8,
    repost_count: 3,
    created_at: '2024-01-15T10:30:00Z',
    user: mockUsers[0],
    room: mockRooms[0],
  },
  {
    id: '2',
    title: 'MacBook Pro M3 - Worth the Upgrade?',
    description: 'After using the new MacBook Pro M3 for a month, I can say it\'s definitely worth it for content creators. The performance boost is incredible.',
    media: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNEVDREMxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+💻 MacBook</text+Cjwvc3ZnPgo=',
    media_type: 'image',
    tags: ['apple', 'laptop', 'review'],
    external_link: '',
    recommendation_type: 'recommend',
    action_type: 'buy',
    like_count: 156,
    comment_count: 23,
    repost_count: 12,
    created_at: '2024-01-14T15:45:00Z',
    user: mockUsers[1],
    room: mockRooms[1],
  },
  {
    id: '3',
    title: 'The Seven Husbands of Evelyn Hugo',
    description: 'What an emotional rollercoaster! This book had me crying and laughing. Taylor Jenkins Reid is a master storyteller. Couldn\'t put it down.',
    media: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDVCN0QxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+📚 Book Cover</text+Cjwvc3ZnPgo=',
    media_type: 'image',
    tags: ['fiction', 'emotional', 'bestseller'],
    external_link: '',
    recommendation_type: 'recommend',
    action_type: 'read',
    like_count: 89,
    comment_count: 15,
    repost_count: 7,
    created_at: '2024-01-13T09:20:00Z',
    user: mockUsers[2],
    room: mockRooms[2],
  },
  {
    id: '4',
    title: 'Avoid This Overpriced Coffee Shop',
    description: 'Went to this trendy coffee place downtown. $8 for a basic latte that tasted burnt. Service was slow and staff seemed uninterested. Save your money.',
    media: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkYzQjMwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+☕ Coffee Shop</text+Cjwvc3ZnPgo=',
    media_type: 'image',
    tags: ['coffee', 'overpriced', 'disappointing'],
    external_link: '',
    recommendation_type: 'not_recommend',
    action_type: 'buy',
    like_count: 67,
    comment_count: 34,
    repost_count: 5,
    created_at: '2024-01-12T14:10:00Z',
    user: mockUsers[0],
    room: mockRooms[0],
  },
  {
    id: '5',
    title: 'Bali Travel Guide - Must Visit Places',
    description: 'Just returned from 2 weeks in Bali. Here are the places you absolutely cannot miss! From hidden beaches to amazing temples.',
    media: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOTZDRUI0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+🏝️ Bali Beach</text+Cjwvc3ZnPgo=',
    media_type: 'image',
    tags: ['bali', 'travel', 'beaches', 'temples'],
    external_link: 'https://example.com/bali-guide',
    recommendation_type: 'recommend',
    action_type: 'watch',
    like_count: 234,
    comment_count: 45,
    repost_count: 18,
    created_at: '2024-01-11T08:00:00Z',
    user: mockUsers[1],
    room: mockRooms[3],
  },
];

export const mockTrendingPosts = [
  {
    ...mockPosts[1], // MacBook Pro post
    trending_score: 95,
    trending_reason: 'Most liked this week',
  },
  {
    ...mockPosts[4], // Bali travel post
    trending_score: 89,
    trending_reason: 'Fastest growing engagement',
  },
  {
    ...mockPosts[2], // Book recommendation
    trending_score: 76,
    trending_reason: 'Most shared',
  },
];

export const mockComments = [
  {
    id: '1',
    post_id: '1',
    content: 'I went there last week! The tiramisu is to die for 😍',
    user: mockUsers[1],
    created_at: '2024-01-15T11:00:00Z',
  },
  {
    id: '2',
    post_id: '1',
    content: 'Thanks for the recommendation! Making a reservation now.',
    user: mockUsers[2],
    created_at: '2024-01-15T12:30:00Z',
  },
];

// Mock current user data
export const mockCurrentUser = {
  id: 'current',
  name: 'Demo User',
  username: 'demouser',
  email: 'demo@example.com',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjk1MDAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE2LjY4NiA1IDIwSDMuNUMzLjUgMTUuODU3OSA3LjM1Nzg2IDEyLjUgMTIgMTIuNUMxNi42NDIxIDEyLjUgMjAuNSAxNS44NTc5IDIwLjUgMjBIMTlDMTkgMTYuNjg2IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
  bio: 'New to i-Recommend! Excited to share my discoveries 🌟',
  external_link: '',
  follower_count: 12,
  following_count: 25,
};

export const mockUserRooms = [
  { id: '1', name: 'Food', color: '#FF6B6B', post_count: 3, created_at: '2024-01-10T10:00:00Z' },
  { id: '2', name: 'Tech', color: '#4ECDC4', post_count: 1, created_at: '2024-01-09T15:30:00Z' },
  { id: '3', name: 'Movies', color: '#FFEAA7', post_count: 0, created_at: '2024-01-08T09:20:00Z' },
];