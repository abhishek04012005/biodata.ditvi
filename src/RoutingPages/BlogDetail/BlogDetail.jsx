import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../../sturcutre/Container/Container';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Heading from '../../sturcutre/Heading/Heading';
import './BlogDetail.css';
import blogPosts from '../../JSON/blogContent';
import Snackbar from '@mui/material/Snackbar';

const createSlug = (title) => {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
};

const BlogDetail = () => {
  
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const currentPost = blogPosts.find(post => createSlug(post.title) === slug);
        if (currentPost) {
            setPost(currentPost);
            setRelatedPosts(blogPosts.filter(p => 
                p.id !== currentPost.id && 
                p.category === currentPost.category
            ).slice(0, 3));
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    const handleShare = async () => {
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: url
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setSnackbarMessage('Link copied to clipboard!');
                setOpenSnackbar(true);
            } catch (err) {
                setSnackbarMessage('Failed to copy link');
                setOpenSnackbar(true);
            }
        }
    };

    const handleLike = () => {
        if (!hasLiked && post) {
            // Update post with new likes count
            setPost({
                ...post,
                likes: post.likes + 1
            });
            setHasLiked(true);
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    if (!post) return null;

    return (
        <section className="blogdetail">
            <div className="blogdetail-background">
                <div className="blogdetail-circle circle-1"></div>
                <div className="blogdetail-circle circle-2"></div>
            </div>
            
            <Container>
                <div className="blogdetail-wrapper">
                    <div className="blogdetail-navigation">
                        <button 
                            className="blogdetail-back"
                            onClick={() => navigate('/blog')}
                        >
                          
                            <span>More Blogs</span>
                        </button>
                        <div className="blogdetail-actions">
                            <button 
                                className={`blogdetail-like ${hasLiked ? 'active' : ''}`}
                                onClick={handleLike}
                            >
                                <ThumbUpIcon /> 
                                <span>{post?.likes || 0}</span>
                            </button>
                            <button 
                                className={`blogdetail-bookmark ${isBookmarked ? 'active' : ''}`}
                                onClick={handleBookmark}
                            >
                                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </button>

                            <button 
                                className="blogdetail-share-btn"
                                onClick={handleShare}
                            >
                                <ShareIcon />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="blogdetail-header">
                        <div className="blogdetail-category">{post.category}</div>
                        <h1 className="blogdetail-title">{post.title}</h1>
                        
                        <div className="blogdetail-meta">
                            <div className="blogdetail-meta-item">
                                <PersonIcon />
                                <span>{post.author}</span>
                            </div>
                            <div className="blogdetail-meta-item">
                                <CalendarTodayIcon />
                                <span>{post.date}</span>
                            </div>
                            <div className="blogdetail-meta-item">
                                <AccessTimeIcon />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="blogdetail-featured-image">
                        <img src={post.image} alt={post.title} />
                    </div>

                    <div className="blogdetail-content">
                        <div 
                            className="blogdetail-text"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="blogdetail-tags">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="blogdetail-tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                     
                    </div>

                    {relatedPosts.length > 0 && (
                        <div className="blogdetail-related">
                            <Heading title="Related Articles" />
                            <div className="blogdetail-related-grid">
                                {relatedPosts.map(relatedPost => (
                                    <div 
                                        key={relatedPost.id}
                                        className="blogdetail-related-card"
                                        onClick={() => navigate(`/blog/${createSlug(relatedPost.title)}`)}
                                    >
                                        <div className="related-image">
                                            <img src={relatedPost.image} alt={relatedPost.title} />
                                            <div className="related-category">
                                                {relatedPost.category}
                                            </div>
                                        </div>
                                        <div className="related-content">
                                            <h3>{relatedPost.title}</h3>
                                            <p>{relatedPost.excerpt}</p>
                                            <div className="related-meta">
                                                <span>{relatedPost.date}</span>
                                                <span>{relatedPost.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                       <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMessage}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    />
                </div>
            </Container>
        </section>
    );
};

export default BlogDetail;