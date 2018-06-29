import axios from 'axios'
import {API_URL} from '../../IP_ADDRESS'

// import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'


/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get(`http://${API_URL}:8080/auth/me`)
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method, locationStr, firstName, lastName) => async dispatch => {
  let res
  try {
    res = await axios.post(`http://${API_URL}:8080/auth/${method}`, {email, password, locationStr, firstName, lastName})
    dispatch(getUser(res.data))
    return res
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post(`http://${API_URL}:8080/auth/logout`)
    dispatch(removeUser())
  } catch (err) {
    console.error(err)
  }
}

  /**
   * INITIAL STATE
   */
  
const defaultUser = {}

    /**
     *
     * REDUCER
     */

export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
