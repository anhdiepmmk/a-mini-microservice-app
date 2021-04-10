import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
    const [posts, setPosts] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);


    const fetchPosts = async () => {
        const res = await axios.get('http://posts.com/posts');
        setPosts(res.data);
    };

    const renderedPosts = Object.values(posts).map(post => {
        return (
          <div className="col-md-4 mb-3" key={post.id}>
            <div className="card">
                <div className="card-body">
                    <h3>{post.title}</h3>
                    <CommentList comments={post.comments} />
                    <CommentCreate postId={post.id} />
                </div>
            </div>
          </div>
        );
    });

    return <div className="row">
      {renderedPosts}
    </div>;
};