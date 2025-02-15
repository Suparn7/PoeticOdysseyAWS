import React, { useEffect, useState } from 'react';
import PostComponent from '../components/PostComponent/PostComponent';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import dynamoService from '../aws/dynamoService';
import { useParams } from 'react-router-dom';

const Post = () => {
    const [post, setPost] = useState(null);
    const [commentSocketUrl, setCommentSocketUrl] = useState('');
    const userData = useSelector((state) => state.user.userData);
    const { slug } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            if(slug){
                const post = await dynamoService.getPost(slug);
                setPost(post);
            }
        }
        fetchPost();
    }, [slug]); 

    useEffect(() => {
        setCommentSocketUrl(`wss://w613ebu3th.execute-api.ap-south-1.amazonaws.com/production/?postId=${post?.blogId}&userId=${userData?.userId}`);
    }, [post?.blogId, userData?.userId]); 

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(commentSocketUrl);
    console.log("socket call received!", sendJsonMessage, lastJsonMessage, readyState);

    return post && userData ? (
        <div className='py-8'>
            <PostComponent post={post} userData={userData} sendJsonMessage={sendJsonMessage} lastJsonMessage={lastJsonMessage} readyState={readyState} />
        </div>
    ) : null
};

export default Post;
