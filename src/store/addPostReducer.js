// import axios from 'axios'
// import { ImageManipulator } from 'expo'
// import qs from 'qs'
import {API_URL} from '../../IP_ADDRESS'
// import 'whatwg-fetch'
// import RNFetchBlob from 'rn-fetch-blob'

const ADD_NEW_POST = 'ADD_NEW_POST'

const addNewPost = (newPost) => {
  return {
    type: ADD_NEW_POST,
    newPost
  }
}

// remove this comment
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
          type: fileType
        })
        let options = {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        }
        const url = `http:${API_URL}:8080/api/posts/media`
        fetcher = await fetch(url, options)
      } else {
        formData.append('mediaPost', {
          uri: info.uri,
          name: `${info.uri}`,
          type: fileType
        })
        let options = {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }
        const url = `http://${API_URL}:8080/api/posts/media`
        fetcher = await fetch(url, options)
      }
      const response = await fetcher.json()
      let mediaUrl = response.mediaUrl
    } catch (err) {
      console.error('error in thunk', err.message)
    }
  }
}

const initialState = {
  newPost: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_POST:
      return {...state, newPost: action.newPost}
    default:
      return state
  }
}
