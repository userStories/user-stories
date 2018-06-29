import axios from 'axios';
import { API_URL } from '../../IP_ADDRESS'
import {
  Dimensions
} from 'react-native';

const GET_ALL_USER_POSTS = 'GET_ALL_USER_POSTS'
const GET_SINGLE_POST = 'GET_SINGLE_POST'
const GET_ALL_POSTS = 'GET_ALL_POSTS'
const GET_POST_ID = 'GET_POST_ID'
const ADD_COMMENT = 'ADD_COMMENT'
const ADD_NEW_POST = 'ADD_NEW_POST'
const CHANGE_LOCATION = 'CHANGE_LOCATION'
const { width, height } = Dimensions.get('window');

const getSinglePost = post => {
  return {
    type: GET_SINGLE_POST,
    post
  }
}

const getAllUserPosts = userPosts => {
  return {
    type: GET_ALL_USER_POSTS,
    userPosts
  }
}

const getAllPosts = posts => {
  return {
    type: GET_ALL_POSTS,
    posts
  }
}

const addNewPost = (newPost) => {
  return {
    type: ADD_NEW_POST,
    newPost
  }
}

const getPostId = postId => {
  return {
    type: GET_POST_ID,
    postId
  }
}

const addComment = comment => {
  return {
    type: ADD_COMMENT,
    comment
  }
}

const changeLocation = (lat, long) => {
  return {
    type: CHANGE_LOCATION,
    latitude: lat,
    longitude: long
  }
}


const initialState = {
  singlePost: {},
  allPosts: [],
  postId: null,
  currentLocation: {
    currentMarker: null,
    latitude: 41.89557129,
    longitude: -87.6386050932,
  }
}

export const getSinglePostThunk = postId => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`http://${API_URL}:8080/api/posts/${postId}`)
      dispatch(getSinglePost(data))
    } catch (err) {
      console.error(err)
    }
  }
}


export const popupThunk = postId => {
  return async dispatch => {
    try {
      dispatch(getPostId(postId))
    } catch (err) {
      console.error(err)
    }
  }
}

export const getAllPostsThunk = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`http://${API_URL}:8080/api/posts`)
      console.log('datata IN THUNK', data)
      dispatch(getAllPosts(data))
    } catch (err) {
      console.error(err);
    }
  }

}

export const postComment = (comment, postId) => {
  return async dispatch => {
    const { data } = await axios.post(`http://${API_URL}:8080/api/comments`, { comment, postId })
    console.log('data in postCommentthunk: ', data)
    dispatch(addComment(data))
  }
}

export const getAllUserPostsThunk = userId => {
  return async (dispatch) => {
    try {
      console.log('here22', userId)
      const { data } = await axios.get(`http://${API_URL}:8080/api/posts/user/${userId}`)
      console.log('data from getalluserpost thunk', data)
      dispatch(getAllUserPosts(data))
    } catch (err) {
      console.error(err)
    }
  }
}

export const addNewPostThunk = (info) => {
  return async (dispatch) => {
    try {
      const formData = new FormData()
      const uriParts = info.uri.split('.')
      let fileType = uriParts[uriParts.length - 1]
      let fetcher = null

      if (fileType === 'jpg') {
        fileType = 'image/jpg'

      } else if (fileType === 'mov') {
        fileType = 'video/quicktime'
      }
      if (fileType === 'image/jpg') {
        formData.append('mediaPost', {
          uri: info.uri,
          // doesnt work as file
          name: `${info.uri}`,
          type: fileType,
        })
        let options = {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
        const url = `http:${API_URL}:8080/api/posts/media`
        fetcher = await fetch(url, options)
      } else {
        formData.append('mediaPost', {
          uri: info.uri,
          name: `${info.uri}`,
          type: fileType,
        })
        let options = {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
        const url = `http://${API_URL}:8080/api/posts/media`
        fetcher = await fetch(url, options)
      }
      const response = await fetcher.json()
      let mediaUrl = response.mediaUrl
      info.mediaLink = mediaUrl
      const newRes = await axios.post(`http://${API_URL}:8080/api/posts/`, info)
      const data = newRes.data.post
      let latitude = data.latitude
      let longitude = data.longitude
      console.log('DATA', data)
      console.log('LATITUDE', latitude)
      console.log('LONGITUDE', longitude)
      dispatch(changeLocation(latitude, longitude))
      dispatch(addNewPost(data))
    } catch (err) {
      console.error('error in thunk', err.message)
    }
  }
}



export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_POST:
      return { ...state, singlePost: action.post }
    case GET_ALL_POSTS:
      return { ...state, allPosts: action.posts }
    case GET_POST_ID:
      return { ...state, postId: action.postId }
    case ADD_COMMENT:
      let newCommentArr = state.singlePost.comments.concat(action.comment.newComment)
      return {
        ...state, singlePost: {
          ...state.singlePost, comments: newCommentArr
        }
      }
    case ADD_NEW_POST:
      let newArr = state.allPosts.concat(action.newPost)
      return { ...state, allPosts: newArr }
    case CHANGE_LOCATION:
      return {
        ...state, currentLocation: {
          ...state.currentLocation, longitude: action.longitude, latitude: action.latitude, currentMarker: null
        }
      }
    default:
      return state
  }
}
