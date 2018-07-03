import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, MapView, View, Button, Image, Dimensions, ScrollView, TouchableHighlight } from 'react-native';
import { getAllUserPostsThunk, getSingleUserThunk, addFriendThunk, loggedInUserThunk, removeFriendThunk, getAllPostsThunk } from '../store';
import {Video} from 'expo'
console.log('here')

const { height } = Dimensions.get('window')

// console.log(Dimensions.get('window'))

class UserProfile extends Component {

  constructor(){
    super();
    this.state = {
      toggleFriend: 1
    }
  }

  componentDidMount = async () => {
    this.props.viewAllPosts()
    const userId = this.props.navigation.getParam('id', 'no input')
    console.log('userId in component did mount: ', userId)
    this.props.singleUserMaker(userId)
    console.log('this.props.loggInUserAuth component did mount else block: ', this.props.loggedInUserAuth.id)
    this.props.viewLoggedInUser(this.props.loggedInUserAuth.id)
  } 

  render () { 
    const {singleUser, allPosts, addFriend, loggedInUser, removeFriend} = this.props
    const imageExt = ['jpeg', 'jpg', 'png', 'gif']
    const videoExt = ['mp4', 'mp3', 'avi', 'flv', 'mov', 'wmv'];
    console.log('Following: ', singleUser.user.Friend.length)
    console.log('Followers: ', singleUser.friends.length)
    return (
      !!loggedInUser ? 
      <View>
        <View
          style={{flexDirection: 'column', width: 125, justifyContent: 'center'}}>
          <Image
            source={{ uri: singleUser.user.profileImg }}
            style={{ width: 125, height: 125, borderRadius: 62.5, margin: 4, borderWidth: 1.5, borderColor: 'rgb(117, 138, 175)' }} />
            <View>
              <Text
                style={{fontFamily: 'Cochin-Bold', textAlign: 'center'}}
              >{singleUser.user.fullName}</Text>
              <Text
                style={{fontFamily: 'Cochin', textAlign: 'center'}}>
              {singleUser.user.tagline}
              </Text>
            </View>
        </View>
        <ScrollView
          vertical
          pagingEnabled >
          <View
            style={{
              height: height + 338,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}>
            {
              allPosts
                .filter(post => {
                  return post.userId === singleUser.user.id
                })
                .map(post =>
                <View
                  key={post.id} style={{marginBottom: 4, marginTop: 4}}>
                  {
                    imageExt.indexOf(post.mediaLink.slice(-3)) !== -1 ?
                    //Ask shaheed how to break the navigation stack
                    <TouchableHighlight onPress={() => this.props.navigation.push('SinglePost', {id: post.id})}>
                    <Image key={post.id}
                      source={{ uri: post.mediaLink }}
                      rate={1.0}
                      volume={1.0}
                      muted={false}
                      resizeMode="cover"
                      style={{ width: 113, height: 113 }}
                    /> 
                    </TouchableHighlight>
                    :
                    <TouchableHighlight   
                    onPress={() => this.props.navigation.push('SinglePost', {id: post.id })}>
                    <Video key={post.id}
                      source={{ uri: post.mediaLink }}
                      style={{ width: 113, height: 113 }}
                    />
                    </TouchableHighlight>
                  }
                </View>
              )
            }
            {
              loggedInUser.user.id !== singleUser.user.id && 
            <TouchableHighlight>
              { !loggedInUser.user.Friend.find(elem => elem.id === singleUser.user.id) ? 
              <Text onPress={() => addFriend(loggedInUser.user.id, singleUser.user.id)}>Follow</Text>: 
              <Text onPress={()=> removeFriend(loggedInUser.user.id, singleUser.user.id)}>UnFollow</Text>
              }
            </TouchableHighlight>
            }
            {
              loggedInUser.user.id === singleUser.user.id &&
              <TouchableHighlight>
                <Text onPress={()=> this.props.navigation.navigate('ActivityLog')}>Activity Log</Text>
              </TouchableHighlight>
            }
          </View>
        </ScrollView>
      </View>: null
    )
  }
}


const styles = StyleSheet.create({

})

const mapStateToProps = state => {
  return {
    allPosts: state.postReducer.allPosts,
    singleUser: state.userReducer.singleUser,
    loggedInUserAuth: state.authReducer,
    loggedInUser: state.userReducer.loggedInUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    singleUserMaker: (id) => dispatch(getSingleUserThunk(id)),
    addFriend: (userId, profileId) => dispatch(addFriendThunk(userId, profileId)),
    viewLoggedInUser: (id) => dispatch(loggedInUserThunk(id)),
    removeFriend: (userId, profileId) => dispatch(removeFriendThunk(userId, profileId)),
    viewAllPosts: () => dispatch(getAllPostsThunk())
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
