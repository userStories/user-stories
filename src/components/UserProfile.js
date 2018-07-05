import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, MapView, View, Button, Image, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';
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

  componentWillMount = async () => {
    this.props.viewAllPosts()
    const userId = this.props.navigation.getParam('id', 'no input')
    console.log('userId in component did mount: ', userId)
    this.props.singleUserMaker(userId)
    console.log('this.props.loggInUserAuth component did mount else block: ', this.props.loggedInUserAuth.id)
    this.props.viewLoggedInUser(this.props.loggedInUserAuth.id)
  } 

  render () { 
    const {singleUser, allPosts, addFriend, loggedInUser, removeFriend} = this.props
    // const user = this.props.thisUser
    const imageExt = ['jpeg', 'jpg', 'png', 'gif']
    const videoExt = ['mp4', 'mp3', 'avi', 'flv', 'mov', 'wmv'];
    console.log('allposts', allPosts)
    return (
      <ScrollView>
        <View style={styles.mainWrap}>
      {
      !!loggedInUser ? 
      <View>
      <Text style={styles.userName}>{singleUser.user.fullName}</Text>
          <View style={styles.followerSectionWrap}>
            <Image
            source={{ uri: singleUser.user.profileImg }}
            style={{ width: 150, height: 150, borderRadius: 75, marginTop: 25, marginLeft: 25, borderWidth: 3, borderColor: 'white' }} />
            <View>
              
              <Text>
              {singleUser.user.tagline}
              </Text>
            </View>
            <View style={styles.subsection}>
              <View style={styles.subsubsection}>
                <Text style={{color: '#0097E6', fontWeight: 'bold', marginLeft: '6%', marginBottom: '10%'}}>Followers: 0</Text>
                <Text  style={{color: '#0097E6', fontWeight: 'bold', marginLeft: '6%', marginBottom: '10%'}}>Following: {singleUser.user.Friend.length}</Text>
              </View>
              {
                loggedInUser.user.id !== singleUser.user.id && 
              <TouchableOpacity>
              <View style={styles.followView}>
                { !loggedInUser.user.Friend.find(elem => elem.id === singleUser.user.id) ? 
                <Text style={styles.followText} onPress={() => addFriend(loggedInUser.user.id, singleUser.user.id)}>Follow</Text>: 
                <Text style={styles.followText} onPress={()=> removeFriend(loggedInUser.user.id, singleUser.user.id)}>UnFollow</Text>
                }
              </View>
              </TouchableOpacity>
              }
              {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ActivityLog')}><View style={styles.activityView}><Text style={styles.activityText}>Activity Log</Text></View></TouchableOpacity> */}
            </View>
          </View>
        <View>
        <Text style={styles.postTitle}>Posts</Text>
          <View
            style={styles.mediaContent}>
            {
              allPosts
                .filter(post => {
                  return post.userId === singleUser.user.id
                })
                .map(post =>
                <View
                  key={post.id}
                  style={styles.mediaWrapper}>
                  {
                    imageExt.indexOf(post.mediaLink.slice(-3)) !== -1 ?
                    //Ask shaheed how to break the navigation stack
                    <TouchableOpacity

                    onPress={() => this.props.navigation.navigate('SinglePost', {id: post.id})}>
                    <View style={styles.mediaView}>
                    <Image key={post.id}
                      source={{ uri: post.mediaLink }}
                      rate={1.0}
                      volume={1.0}
                      muted={false}
                      resizeMode="cover"
                      style={styles.media}
                    />
                    </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity

                    onPress={() => this.props.navigation.navigate('SinglePost', {id: post.id })}>
                    <View style={styles.mediaView}>
                    <Video key={post.id}
                      resizeMode='cover'
                      source={{ uri: post.mediaLink }}
                      style={styles.media}
                    />
                    </View>
                    </TouchableOpacity>
                  }
                </View>
              )
            }
          </View>
        </View>
      </View>: null
          }
        </View>
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor: '#eee',
    flex: 1
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
    alignSelf: 'center',
    color: '#0097E6'
  },
  followerSectionWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  subsection: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  subsubsection: {
    flexDirection: 'row',
  },
  mediaContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 620
  },
  followView: {
    borderColor: 'white',
    borderWidth: 3,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  followText: {
    fontWeight: "bold",
    color: '#0097E6'
  },
  activityView: {
    borderColor: 'white',
    borderWidth: 3,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginTop: '8%',
    alignItems: 'center'
  },
  activityText: {
    fontWeight: "bold",
    color: '#0097E6'
  },
  postTitle: {
    color: '#0097E6',
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 20
  },
  mediaView: {
    marginTop: 20,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#EEE',
    borderRadius: 10
    
  },
  media: {
    width: 100,
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
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
