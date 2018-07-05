import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Animated, StyleSheet, Text, MapView, View, Image, FlatList, ScrollView, TextInput,  TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight  } from 'react-native';
import { Video } from 'expo'
import { getSinglePostThunk, postComment, getAllUsersThunk} from '../store'
import {Button} from 'react-native-elements'
import {ListItem} from 'native-base'
import Loader from './Loader'
import CommentSection from './Comments'


class SinglePost extends Component {
  constructor(){
    console.log('in construct')
    super();
    this.state = {
      comment: "",
      descriptionToggle: -1,
      commentToggle: -1,
      loading: true
    };
  }


  //last try
  componentDidMount() {
    console.log('HERERERE')
    const id = this.props.navigation.getParam('id', 'no input')
    console.log('comp di dmountthe id', id)
    this.props.singlePostMaker(id)
    this.props.displayUsers()
  }

  handleChange = (event) => {
    this.setState({comment: event})
  }

  handleSubmit = () => {
    this.props.addComment(this.state.comment, this.props.singlePost.id, this.props.loggedInUser.id)
    this.setState({comment: ""})
  }

  changeDescription = () => {
    let change = this.state.descriptionToggle *= -1
    this.setState({
      descriptionToggle: change
    })
  }
  changeComment = () => {
    let change2 = this.state.commentToggle *= -1
    this.setState({
      commentoggle: change2
    })
  }

  commentNavigation = (profileId) => {
    this.props.navigation.navigate('UserProfile', {id: profileId})
  }

  render() {
    console.log('reached render')
    // console.log('singlepost', this.props.singlePost)
    const imageExt = ['jpeg', 'jpg', 'png', 'gif']
    const videoExt = ['mp4', 'mp3', 'avi', 'flv', 'mov', 'wmv'];
    return (
      // <ScrollView
      // keyboardShouldPersistTaps={true}
      // keyboardDismissMode="on-drag"
      //   contentContainerStyle={{
      //     justifyContent: 'space-between',
      //   }}
      // >
      <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
      <Animated.ScrollView>
      <Loader 
          loading={this.state.loading} />
        {this.props.singlePost.mediaLink && !!this.props.allUsers.length ?
          <View style={styles.OuterViewWrap}>
            <Text style={styles.title}>{this.props.singlePost.title}</Text>
            {videoExt.indexOf(this.props.singlePost.mediaLink.slice(-3)) !== -1 ?
              <Video
                source={{ uri: this.props.singlePost.mediaLink }}
                rate={1.0}
                volume={1.0}
                muted={false}
                loading={true}
                resizeMode="cover"
                shouldPlay
                isLooping
                onLoad={() => this.setState({loading: false})}
                style={styles.imageWrap}
              />
              : <Image onLoad={() => this.setState({loading: false})} style={styles.imageWrap} source={{ uri: this.props.singlePost.mediaLink }} />
            }
            <View>

              {
                this.props.allUsers.find(user => user.id === this.props.singlePost.userId) &&
                <TouchableHighlight style={{ alignItems: 'center' }}>
                  <View style={styles.profileLink}>
                    <Text style={styles.linkText} onPress={() => this.props.navigation.navigate('UserProfile', {id: this.props.singlePost.userId})}>{this.props.allUsers.find(user => user.id === this.props.singlePost.userId).firstName}'s Profile</Text>
                  </View>
                </TouchableHighlight>
              }
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text multiline={true} style={styles.descriptionText}>{this.props.singlePost.text}</Text>
            </View>
            {
              (this.state.commentToggle === -1) ? <TouchableOpacity onPress={this.changeComment}><View style={styles.commentButtons}><Text style={styles.commentText}>View Comments</Text></View></TouchableOpacity> :
              <TouchableOpacity onPress={this.changeComment}><View style={styles.commentButtons}><Text style={styles.commentText}>Hide Comments</Text></View></TouchableOpacity>
            }
            {
              this.state.commentToggle === 1 ? 
              <CommentSection comments={this.props.singlePost.comments} users={this.props.allUsers} commentNavigation={this.commentNavigation} stateComment={this.state.comment} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>: null
            }
            
          </View> :
          <View style={styles.OuterViewWrap}>
            <Text>{this.props.singlePost.title}</Text>
            <Text>{this.props.singlePost.text}</Text>
          </View>}
          </Animated.ScrollView>
          </TouchableWithoutFeedback>
    )

  }
}

const styles = StyleSheet.create({
  OuterViewWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE',
    paddingBottom: 200
  },
  imageWrap: {
    width: 350,
    height: 300,
    marginBottom: "2.5%",
    borderRadius: 6
  },
  descriptionText: {
    fontSize: 15,
    marginRight: '5%',
    marginLeft: '5%',
    alignItems: 'center',
    marginTop: "2.5%",
    marginBottom: "5%",
    color: '#00a8ff'
    // paddingRight: '5%',
    // paddingLeft: '5%'

  },
  commentButtons: {
    borderWidth: 3,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    borderColor: 'white',
    paddingBottom: 10,
    borderRadius: 10
  },
  commentText: {
    fontWeight: "bold",
    color: '#00a8ff'
  },
  title: {
    fontWeight: "bold",
    marginTop: "5%",
    color: '#00a8ff',
    marginBottom: "5%"
  },
  descriptionTitle: {
    alignSelf: "center",
    fontWeight: "bold",
    // marginBottom: "2.5%",
    color: '#00a8ff'
  },
  commentTitle: {
    marginTop: 40,
    fontWeight: "bold",
    marginBottom: "5%",
    color: 'white'
  },
  profileLink: {
    alignItems: "center",
    marginTop: '2%',
    marginBottom: '2%',
    borderColor: 'white',
    borderWidth: 2,
    // paddingLeft: 3,
    // paddingRight: 3,
    width: 80,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 10
  },
  linkText: {
    fontWeight: "bold",
    color: '#00a8ff',
    textAlign: 'center'
  }

})
const mapStateToProps = state => {
  return {
    singlePost: state.postReducer.singlePost,
    allUsers: state.userReducer.allUsers,
    loggedInUser: state.authReducer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    singlePostMaker: (postId) => dispatch(getSinglePostThunk(postId)),
    addComment: (comment, postId, userId) => dispatch(postComment(comment, postId, userId)),
    displayUsers: () => dispatch(getAllUsersThunk())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SinglePost);
