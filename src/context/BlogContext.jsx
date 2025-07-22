import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    // Load data from localStorage
    const savedPosts = localStorage.getItem('blog_posts');
    const savedTags = localStorage.getItem('blog_tags');
    const savedComments = localStorage.getItem('blog_comments');

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createPost = (postData) => {
    const newPost = {
      id: uuidv4(),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    saveToStorage('blog_posts', updatedPosts);
    return newPost.id;
  };

  const updatePost = (id, postData) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, ...postData, updatedAt: new Date().toISOString() } : post
    );
    setPosts(updatedPosts);
    saveToStorage('blog_posts', updatedPosts);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    saveToStorage('blog_posts', updatedPosts);
    
    // Remove comments for this post
    const { [id]: _, ...remainingComments } = comments;
    setComments(remainingComments);
    saveToStorage('blog_comments', remainingComments);
  };

  const createTag = (tagData) => {
    const newTag = {
      id: uuidv4(),
      ...tagData,
      createdAt: new Date().toISOString()
    };
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    saveToStorage('blog_tags', updatedTags);
    return newTag.id;
  };

  const updateTag = (id, tagData) => {
    const updatedTags = tags.map(tag => 
      tag.id === id ? { ...tag, ...tagData } : tag
    );
    setTags(updatedTags);
    saveToStorage('blog_tags', updatedTags);
  };

  const deleteTag = (id) => {
    // Find all child tags
    const childTagIds = getAllChildTagIds(id);
    
    // Update posts to remove the deleted tags
    const tagsToRemove = [id, ...childTagIds];
    const updatedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.filter(tagId => !tagsToRemove.includes(tagId))
    }));
    
    // Remove the tags
    const updatedTags = tags.filter(tag => !tagsToRemove.includes(tag.id));
    
    setPosts(updatedPosts);
    setTags(updatedTags);
    saveToStorage('blog_posts', updatedPosts);
    saveToStorage('blog_tags', updatedTags);
  };

  const getAllChildTagIds = (parentId) => {
    const childIds = [];
    
    const findChildren = (id) => {
      const children = tags.filter(tag => tag.parentId === id);
      children.forEach(child => {
        childIds.push(child.id);
        findChildren(child.id);
      });
    };
    
    findChildren(parentId);
    return childIds;
  };

  const addComment = (postId, comment) => {
    const newComment = {
      id: uuidv4(),
      ...comment,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    const postComments = comments[postId] || [];
    const updatedComments = {
      ...comments,
      [postId]: [...postComments, newComment]
    };
    
    setComments(updatedComments);
    saveToStorage('blog_comments', updatedComments);
  };

  const updateComment = (postId, commentId, updatedData) => {
    const updatedComments = { ...comments };
    
    const updateCommentInArray = (commentsArray) => {
      return commentsArray.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, ...updatedData };
        }
        
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentInArray(comment.replies)
          };
        }
        
        return comment;
      });
    };
    
    if (updatedComments[postId]) {
      updatedComments[postId] = updateCommentInArray(updatedComments[postId]);
      setComments(updatedComments);
      saveToStorage('blog_comments', updatedComments);
    }
  };

  const deleteComment = (postId, commentId) => {
    const updatedComments = { ...comments };
    
    const filterCommentsArray = (commentsArray) => {
      return commentsArray.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = filterCommentsArray(comment.replies);
        }
        
        return true;
      });
    };
    
    if (updatedComments[postId]) {
      updatedComments[postId] = filterCommentsArray(updatedComments[postId]);
      setComments(updatedComments);
      saveToStorage('blog_comments', updatedComments);
    }
  };

  const addReply = (postId, commentId, replyData) => {
    const updatedComments = { ...comments };
    
    const addReplyToComment = (commentsArray) => {
      return commentsArray.map(comment => {
        if (comment.id === commentId) {
          const newReply = {
            id: uuidv4(),
            ...replyData,
            createdAt: new Date().toISOString(),
            replies: []
          };
          
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        
        if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies)
          };
        }
        
        return comment;
      });
    };
    
    if (updatedComments[postId]) {
      updatedComments[postId] = addReplyToComment(updatedComments[postId]);
      setComments(updatedComments);
      saveToStorage('blog_comments', updatedComments);
    }
  };

  const getPostComments = (postId) => {
    return comments[postId] || [];
  };

  const getTagHierarchy = () => {
    const tagMap = {};
    tags.forEach(tag => {
      tagMap[tag.id] = { ...tag, children: [] };
    });

    const rootTags = [];
    tags.forEach(tag => {
      if (tag.parentId) {
        if (tagMap[tag.parentId]) {
          tagMap[tag.parentId].children.push(tagMap[tag.id]);
        }
      } else {
        rootTags.push(tagMap[tag.id]);
      }
    });

    return rootTags;
  };

  const getTagPostCount = () => {
    const counts = {};
    
    // Function to count posts for a tag and its children
    const countPostsForTag = (tagId) => {
      let count = 0;
      
      // Count direct posts
      posts.forEach(post => {
        if (post.tags.includes(tagId)) {
          count++;
        }
      });
      
      // Add counts from all children
      const children = tags.filter(tag => tag.parentId === tagId);
      children.forEach(child => {
        count += countPostsForTag(child.id);
      });
      
      counts[tagId] = count;
      return count;
    };
    
    // Count for all root tags
    tags.filter(tag => !tag.parentId).forEach(tag => {
      countPostsForTag(tag.id);
    });
    
    return counts;
  };

  const getPostsByTag = (tagId) => {
    // Get this tag and all child tags
    const relevantTagIds = [tagId];
    
    const addChildTags = (parentId) => {
      const children = tags.filter(tag => tag.parentId === parentId);
      children.forEach(child => {
        relevantTagIds.push(child.id);
        addChildTags(child.id);
      });
    };
    
    addChildTags(tagId);
    
    // Find posts with any of these tags
    return posts.filter(post => {
      return post.tags.some(tag => relevantTagIds.includes(tag));
    });
  };

  const getTag = (tagId) => {
    return tags.find(tag => tag.id === tagId);
  };

  const value = {
    posts,
    tags,
    comments,
    createPost,
    updatePost,
    deletePost,
    createTag,
    updateTag,
    deleteTag,
    addComment,
    updateComment,
    deleteComment,
    addReply,
    getPostComments,
    getTagHierarchy,
    getTagPostCount,
    getPostsByTag,
    getTag
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};