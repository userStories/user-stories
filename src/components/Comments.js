import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Animated, StyleSheet, Text, MapView, View, Image, FlatList, ScrollView, TextInput,  TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight  } from 'react-native';
import { Video } from 'expo'
import { getSinglePostThunk, postComment, getAllUsersThunk} from '../store'
import {Button} from 'react-native-elements'
import {ListItem} from 'native-base'

export default class CommentSection extends Component {
    render(){
        const {comments, users, stateComment, handleChange, handleSubmit, loggedInUser, commentNavigation} = this.props
        return (
        <View style={styles.OuterView}>
            <View
            style={{marginBottom: 10}}>
              <TextInput
                multiline={true}
                onChangeText={handleChange}
                value={stateComment}
                style={{color: '#00a8ff', marginTop: 10}}
                placeholderTextColor='#00a8ff'
                placeholder='Add a comment!'
              />
            </View>
            <View>
              {
                !!stateComment.length? 
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.submitButton}>
                        <Text style={styles.sumbitText}>Submit Comment</Text>
                    </View>
                </TouchableOpacity>
                : null
                // !!stateComment.length? 
            }
            </View>
            <View>
            {comments
              .sort((a,b) => {
                return ( (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0) );
              })
              .map((comment, index) => {
                  return (
                    <View key={comment.id}  style={styles.commentWrap}>
                        <View style={styles.innerViewWrap}>
                            {users.find(user => user.id === comment.userId) &&
                            <Text style={{fontWeight: 'bold', color: '#00a8ff', marginBottom: '1%'}}>{users.find(user => user.id === comment.userId).fullName}</Text>
                            }
                            <View style={styles.commentTextView}>
                                <Text multiline={true} style={styles.comments}>{comment.content}</Text> 
                            </View>
                        </View>
                    </View>
                  )
            })}</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    OuterView: {
        // justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    userName: {
        paddingRight: 100
    },
    innerViewWrap: {
        width: 325
    },
    commentWrap: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        borderColor: 'white',
        borderRadius: 5,
        backgroundColor: '#eee',
        borderWidth: 2,
    },
      commentButton: {
        backgroundColor: 'red',
        marginBottom: '5%'
      },
      submitButton: {
        borderColor: 'white',
        borderWidth: 3,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10
      },
      sumbitText: {
        fontWeight: "bold",
        color: '#00a8ff'
      },
      comments: {
          color: '#00a8ff'
      }
})
