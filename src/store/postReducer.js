import fetch from 'fetch';
import axios from 'axios';

const GET_SINGLE_POST = "GET_SINGLE_POST"
const GET_ALL_POSTS = "GET_ALL_POSTS"
const GET_POST_ID = "GET_POST_ID"
const HOST_IP_ADDRESS='172.17.20.201'

const getSinglePost = post => {
    return {
        type: GET_SINGLE_POST,
        post
    }
}

const getAllPosts = posts => {
    return {
        type:GET_ALL_POSTS,
        posts 
    }
}

const getPostId = postId => {
    return {
        type: GET_POST_ID,
        postId
    }
}


const initialState = {
    singlePost: {},
    allPosts: [],
    postId: null,
}

export const getSinglePostThunk = postId =>{
    return async dispatch => {
        try{
            console.log('postId in thunk: ', postId)
            // const {data} = await axios.get(`http://localhost:8080/api/posts/${postId}`)
            // const {data} = await axios.get(`http://172.17.20.159:8080/api/posts/${postId}`)
            // const {data} = await axios.get(`http://192.168.1.106:8080/api/posts/${postId}`)
            // const {data} = await axios.get(`http://172.31.98.214:8080/api/posts/${postId}`)
            const {data} = await axios.get(`http://${HOST_IP_ADDRESS}:8080/api/posts/${postId}`)

            console.log('data in thunk: ', data)
            dispatch(getSinglePost(data))
        } catch(err){
            console.error(err)
        }
    }
}

export const popupThunk = postId =>{
    return async dispatch =>{
        try{
            console.log('postId in popUpthunk: ', postId)
            dispatch(getPostId(postId))
        }catch(err){
            console.error(err)
        }
    }
}

export const getAllPostsThunk = () => {
    return async (dispatch) =>{
        try{
            // const {data} = await axios.get('http://localhost:8080/api/posts')
            // const {data} = await axios.get(`http://172.17.20.159:8080/api/posts`)
            // const {data} = await axios.get(`http://192.168.1.106:8080/api/posts`)
            // const {data} = await axios.get(`http://172.31.98.214:8080/api/posts)
            const {data} = await axios.get(`http://${HOST_IP_ADDRESS}:8080/api/posts`)

            console.log('data in all posts thunk: ', data)
            dispatch(getAllPosts(data))
        } catch(err){
            console.error(err);
        }
    }
    
}

export const postReducer = (state = initialState, action) =>{
    switch(action.type){
        case GET_SINGLE_POST:
            return {...state, singlePost: action.post}
        case GET_ALL_POSTS:
            return {...state, allPosts: action.posts}
        case GET_POST_ID:
            return {...state, postId: action.postId}
        default:
            return state
    }
}