import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../sturcutre/Container/Container';
import Heading from '../../sturcutre/Heading/Heading';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import blogPosts from '../../JSON/blogContent';
import './AllBlogs.css';

const BlogCard = ({ post }) => {
    const navigate = useNavigate();
    
    const createSlug = (title) => {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    return (
        <div className="allblogs-card">
            <div className="allblogs-card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="allblogs-category">{post.category}</div>
            </div>
            <div className="allblogs-card-content">
                <div className="allblogs-meta">
                    <div className="allblogs-meta-item">
                        <PersonIcon />
                        <span>{post.author}</span>
                    </div>
                    <div className="allblogs-meta-item">
                        <CalendarTodayIcon />
                        <span>{post.date}</span>
                    </div>
                    <div className="allblogs-meta-item">
                        <AccessTimeIcon />
                        <span>{post.readTime}</span>
                    </div>
                </div>
                <h3 className="allblogs-title">{post.title}</h3>
                <p className="allblogs-excerpt">{post.excerpt}</p>
                <button 
                    className="allblogs-read-more"
                    onClick={() => navigate(`/blog/${createSlug(post.title)}`)}
                >
                    Read More
                    <ArrowForwardIcon />
                </button>
            </div>
        </div>
    );
};

const AllBlogs = () => {
    return (
        <section className="allblogs-section">
            <div className="allblogs-background">
                <div className="allblogs-circle circle-1"></div>
                <div className="allblogs-circle circle-2"></div>
            </div>
            
            <Container>
                <div className="allblogs-header">
                    <div className="allblogs-header-design">
                        <span className="allblogs-design-element"></span>
                        <Heading title="Our Blog Posts" />
                        <span className="allblogs-design-element"></span>
                    </div>
                    <p className="allblogs-subtitle">
                        Explore our complete collection of articles and biodata creation guides
                    </p>
                </div>

                <div className="allblogs-grid">
                    {blogPosts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default AllBlogs;