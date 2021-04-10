import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

export default () => {
    return <div className="container">
        <div className="row">
            <div className="col-md-6">
                <h1>Create Post</h1>
                <PostCreate /> 
            </div>
        </div>
        <hr />
        <h1>Posts</h1>
        <PostList />
    </div>;
};