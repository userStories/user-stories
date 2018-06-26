import axios from 'axios'
import { ImageManipulator } from 'expo'
import qs from 'qs'

const ADD_NEW_POST = 'ADD_NEW_POST'
const HOST_IP_ADDRESS='172.17.20.201'

const addNewPost = (newPost) => {
  return {
    type: ADD_NEW_POST,
    newPost
  }
}


export const addNewPostThunk = (info) => {
  return async (dispatch) => {

    // "change method to post"
    // "change header to form data???"
    // "deploy api to heroku and adjust url"
    try {
      
      let newObj = await Expo.ImageManipulator.manipulate(info.uri, null, { base64: true })
      // let formData = new FormData()
      console.log('newobj', newObj)
      console.log('info object', info)
      // console.log('specific uri', info.uri)
      // formData.append('file', newObj)



      // const rawResponse = await fetch('http://172.17.20.159:8080/api/posts/', {
      const rawResponse = await fetch(`http://${HOST_IP_ADDRESS}:8080/api/posts/`, {
        method: 'POST',
        headers: {
          'X-AYLIEN-TextAPI-Application-ID': '6aca562c',
          'X-AYLIEN-TextAPI-Application-Key': '4cc1a266da1f4cc14396b900072e9a1d',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(newObj)
      })





      // const response = await axios.post(`http://localhost:8080/api/posts/1`, formData, )
    const data = rawResponse.data
    console.log('deettaaa', data)
    const action = addNewPost(data)
    dispatch(action)
    } catch (err) {
      console.error('error in thunk', err.message)
    }
  }
}

const initialState = {
  newPost: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_POST:
      return {...state, newPost: action.newPost}
    default:
      return state
  }
}
