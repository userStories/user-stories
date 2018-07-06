import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, MapView, View, Button, Image, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';
import { getAllUserPostsThunk, getSingleUserThunk, addFriendThunk, loggedInUserThunk, removeFriendThunk } from '../store';
import {Video} from 'expo'
import {Container, Content, Card, CardItem, Header, Body} from 'native-base' 
import Loader from './Loader'

class ActivityLog extends Component {
    constructor(){
        super();
        this.state = {
            loading: false
        }
    }

    notLoaded = () => {
        this.setState({loading: true})
    }

    nowLoaded = () => {
        this.setState({loading: false})
    }
    //recommit
    render(){
        const {allPosts, loggedInUser, loggedInUserAuth} = this.props
        const imageExt = ['jpeg', 'jpg', 'png', 'gif']
        const videoExt = ['mp4', 'mp3', 'avi', 'flv', 'mov', 'wmv'];
        console.log('all the posts', allPosts)
        return (
            <ScrollView>
            <View style={{flex: 1, backgroundColor: '#eee', alignItems: 'center'}}>
            <Loader
            loading={this.state.loading} />
            <Text style={styles.title}>My Activity Log</Text>
            {
                allPosts
                    .filter(post => loggedInUser.user.Friend.find(elem => post.userId === elem.id))
                    .map(post => {
                        return (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SinglePost', { id: post.id })} key={post.id}>
                            <View style={styles.elemWrapper} >
                            <View style={styles.smallerWrapper}>
                                <View style={styles.textWrap}>
                                        <Text style={styles.userName}>{post.user.fullName}</Text>
                                        <Text style={styles.elemText}>{post.title}</Text>
                                </View>
                                <View style={styles.postWrapper}>
                                {
                                    videoExt.indexOf(post.mediaLink.slice(-3)) !== -1 ?
                                    <Video
                                        source={{ uri: post.mediaLink }}
                                        rate={1.0}
                                        volume={0}
                                        muted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        onLoadStart={this.notLoaded}
                                        onLoad={this.nowLoaded}
                                        style={styles.imageWrap}
                                    />
                                    : <Image onLoadStart={this.notLoaded}
                                    onLoad={this.nowLoaded} style={styles.imageWrap} source={{ uri: post.mediaLink }} />
                                    }
                                </View>
                            </View>
                            </View>
                        </TouchableOpacity>
                        ) 
                    })
            }    
          </View>
          </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        color: '#00a8ff',
        fontSize: 30,
        alignSelf: 'center',
        marginTop: 10,
        alignSelf: 'center'
    },
    userName: {
        color: '#00a8ff',
        fontSize: 18,
        marginTop: 10,

        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    textWrap: {
        // flexDirection: 'c',
        
        marginRight: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingRight: 15
        
    },
    postWrapper: {
    },
    elemWrapper: {
        width: '90%',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 120
    },
    smallerWrapper: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    elemText: {
        alignSelf: 'center',
        color: '#00a8ff',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 10,
        width: 160
    },
    imageWrap: {
        width: 110,
        height: 110,
    }
})

const MapStateToProps = state =>{
    return {
        allPosts: state.postReducer.allPosts,
        loggedInUserAuth: state.authReducer,
        loggedInUser: state.userReducer.loggedInUser
    }
}

export default connect(MapStateToProps)(ActivityLog)

