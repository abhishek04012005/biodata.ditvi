import React from 'react';
import './Blog.css';
import Container from '../../sturcutre/Container/Container';
import Heading from '../../sturcutre/Heading/Heading';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleIcon from '@mui/icons-material/Article';
import blogPosts from '../../JSON/blogContent';


const BlogCard = ({ post }) => {
    const navigate = useNavigate();

    const createSlug = (title) => {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    return (
        <div className="blog-card">
            <div className="blog-card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="blog-category">{post.category}</div>
            </div>
            <div className="blog-card-content">
                <div className="blog-meta">
                    <div className="blog-meta-item">
                        <PersonIcon />
                        <span>{post.author}</span>
                    </div>
                    <div className="blog-meta-item">
                        <AccessTimeIcon />
                        <span>{post.readTime}</span>
                    </div>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <button
                    className="blog-read-more"
                    onClick={() => navigate(`/blog/${createSlug(post.title)}`)}
                >
                    Read More
                    <ArrowForwardIcon />
                </button>
            </div>
        </div>
    );
};

const Blog = () => {
    const navigate = useNavigate();
    return (
        <section className="blog">
            <div className="blog-background">
                <div className="blog-circle circle-1"></div>
                <div className="blog-circle circle-2"></div>
            </div>

            <Container>
                <div className="blog-header">
                    <div className="blog-header-design">
                        <span className="blog-design-element"></span>
                        <Heading title="Latest Blog Posts" />
                        <span className="blog-design-element"></span>

                    </div>
                    <p className="blog-subtitle">
                        Stay updated with our latest articles and biodata creation tips
                    </p>




                </div>

                <div className="blog-grid">
                    {blogPosts.slice(0, 3).map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}


                </div>

                <div className="blog-more">
                    <button
                        className="blog-more-btn"
                        onClick={() => navigate('/blog')}
                    >
                        <ArticleIcon />
                        <span>More Blogs</span>
                        <ArrowForwardIcon />
                    </button>
                </div>
            </Container>
        </section>
    );
};

export default Blog;