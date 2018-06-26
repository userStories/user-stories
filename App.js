import React from 'react';
import { StyleSheet } from "react-native";
import { Provider } from 'react-redux'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import NewPost from './src/components/NewPost'
import TakePicture from './src/components/TakePicture'
import RecordVideo from './src/components/RecordVideo'
// import Home from './src/components/Home'
import SinglePost from './src/components/SinglePost'
import store from './src/store/index'
import MyMap, { MyLocation } from './src/components/MyMap'
import UserProfile from './src/components/UserProfile'

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <StackNav />
      </Provider>
    );
  }
}


console.log('store: ', store)

const Tabs = createBottomTabNavigator({
  post: NewPost,
  location: MyLocation,
  profile: UserProfile,
})

const StackNav = createStackNavigator({
  MyMap: {
    screen: MyMap,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: 'blue',
      title: 'Map',
      headerStyle: styles.header,
    })
  },
  SinglePost: {
    screen: SinglePost,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: 'blue',
      title: 'Post',
      headerStyle: styles.header,
    })
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: 'blue',
      title: 'Welcome',
      headerStyle: styles.header,
    })
  },
  TakePicture: {
    screen: TakePicture,
  },
  RecordVideo: {
    screen: RecordVideo,
  },
  NewPost: {
    screen: NewPost,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: 'blue',
      title: 'Add New Post',
      headerStyle: styles.header,
    })
  },
})

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#eee', 
    borderWidth: 1, 
    height: 40,
	},
});

export default App
