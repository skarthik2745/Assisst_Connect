import React, { useState } from 'react';
import { ArrowLeft, Users, MessageCircle, Heart, Reply, Search, Filter, PlusCircle } from 'lucide-react';

interface CommunityForumProps {
  onClose: () => void;
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
  isLiked: boolean;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Sarah M.',
      title: 'Tips for video call captioning',
      content: 'Has anyone found good settings for automatic captions during work meetings? I\'m looking for recommendations.',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 5,
      category: 'technology',
      isLiked: false
    },
    {
      id: 2,
      author: 'Mike R.',
      title: 'Sign language learning resources',
      content: 'Sharing some great online resources I\'ve found for learning ASL. Would love to hear about others!',
      timestamp: '5 hours ago',
      likes: 18,
      replies: 8,
      category: 'education',
      isLiked: true
    },
    {
      id: 3,
      author: 'Lisa K.',
      title: 'Emergency alert system feedback',
      content: 'The new vibration patterns are really helpful! Much better than the old system.',
      timestamp: '1 day ago',
      likes: 7,
      replies: 3,
      category: 'feedback',
      isLiked: false
    },
    {
      id: 4,
      author: 'David T.',
      title: 'Meetup planning for next month',
      content: 'Planning a local deaf community meetup. Who\'s interested in joining? Looking for venue suggestions.',
      timestamp: '2 days ago',
      likes: 15,
      replies: 12,
      category: 'events',
      isLiked: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'technology', name: 'Technology', count: posts.filter(p => p.category === 'technology').length },
    { id: 'education', name: 'Education', count: posts.filter(p => p.category === 'education').length },
    { id: 'feedback', name: 'Feedback', count: posts.filter(p => p.category === 'feedback').length },
    { id: 'events', name: 'Events', count: posts.filter(p => p.category === 'events').length },
    { id: 'general', name: 'General', count: posts.filter(p => p.category === 'general').length }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const createPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      category: newPostCategory,
      isLiked: false
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreatingPost(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to deaf portal"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Users size={24} className="text-teal-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600">Connect with the deaf community</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label htmlFor="search-posts" className="block text-lg font-semibold text-gray-900 mb-3">
              Search Posts
            </label>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="search-posts"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setIsCreatingPost(true)}
                className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center hover:bg-teal-200 transition-colors duration-200"
                aria-label="Create new post"
              >
                <PlusCircle size={16} className="text-teal-600" aria-hidden="true" />
              </button>
            </div>
            
            <nav role="navigation" aria-label="Forum categories">
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-teal-100 text-teal-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      aria-current={selectedCategory === category.id ? 'page' : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Create Post Modal */}
          {isCreatingPost && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-teal-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Post</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Write your post content..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="post-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="post-category"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={createPost}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200"
                    aria-label="Publish post"
                  >
                    <PlusCircle size={16} aria-hidden="true" />
                    <span>Post</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsCreatingPost(false);
                      setNewPostTitle('');
                      setNewPostContent('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCategory === 'all' ? 'All Discussions' : categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">{filteredPosts.length} posts</p>
                </div>
                <button
                  onClick={() => setIsCreatingPost(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors duration-200"
                  aria-label="Create new post"
                >
                  <PlusCircle size={16} aria-hidden="true" />
                  <span>New Post</span>
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                  <p>No posts found</p>
                  <p className="text-sm">Be the first to start a discussion!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users size={16} className="text-teal-600" aria-hidden="true" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize flex-shrink-0">
                              {post.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>by {post.author}</span>
                              <span>{post.timestamp}</span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors duration-200 ${
                                  post.isLiked
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                aria-label={`${post.isLiked ? 'Unlike' : 'Like'} post: ${post.title}`}
                              >
                                <Heart size={14} className={post.isLiked ? 'fill-current' : ''} aria-hidden="true" />
                                <span>{post.likes}</span>
                              </button>
                              
                              <button
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                aria-label={`View ${post.replies} replies to ${post.title}`}
                              >
                                <Reply size={14} aria-hidden="true" />
                                <span>{post.replies}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="mt-8 bg-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-teal-900 mb-3">Community Guidelines</h3>
        <ul className="space-y-2 text-teal-800" role="list">
          <li>• Be respectful and supportive of all community members</li>
          <li>• Share experiences, tips, and resources that help others</li>
          <li>• Use clear, descriptive titles for your posts</li>
          <li>• Choose appropriate categories to help others find your content</li>
          <li>• Report any inappropriate content to moderators</li>
          <li>• Celebrate achievements and milestones together</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityForum;