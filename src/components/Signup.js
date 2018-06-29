import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { auth } from '../store/authReducer';
import Loader from './Loader'

class Signup extends Component {
  constructor () {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      location: '',
      loading: false,
      formError: false
    }
  }

  validateSignup = async () => {
    this.setState({ loading: true })
    const { firstName, lastName, email, password, location } = this.state
    const res = await this.props.submitNewUser(email, password, 'signup', location, firstName, lastName)
      res.status === 200 
      ? this.signup()
      : this.setState({ formError: true, loading: false })

  }

  signup = () => {
    this.setState({ loading: false })
    const { push } = this.props.navigation
    push('Home')
  }

  render () {
    const {
      firstName, lastName, email, password, location
    } = this.state
    return (
      <View>
        <FormInput
          value={firstName}
          onChangeText={firstName => this.setState({ firstName })}
          placeholder="First Name"
        />
        <FormInput
          value={lastName}
          onChangeText={lastName => this.setState({ lastName })}
          placeholder="Last Name"
        />
        <FormInput
          value={email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
        />
        <FormInput
          value={password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry
        />
        <FormInput
          value={location}
          onChangeText={location => this.setState({ location })}
          placeholder="Location"
        />
        {this.state.formError && 
          (
            <Text>
              Data Invalid! Make sure your email is valid and you entered a passoword!
            </Text>
          )
        }
        <Button
          title="Signup"
          onPress={this.validateSignup}
        />
        <Loader 
          loading={this.state.loading} />
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitNewUser: (email, password, method, location, firstName, lastName) => dispatch(auth(email, password, method, location, firstName, lastName))
  }
}

export default connect(null, mapDispatchToProps)(Signup)