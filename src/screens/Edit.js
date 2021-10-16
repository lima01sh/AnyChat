// import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
// import firebase from '../database/firebaseDb';
import React, { useState, useEffect, Component } from 'react';
import { IconButton, Title } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';
// import firestore from '@react-native-firebase/firestore';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import useStatsBar from '../utils/useStatusBar';
import HomeScreen from '../screens/HomeScreen';
// import { ThemeProvider, Button, Input, Image } from 'react-native-elements'

class Edit extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      createdAt: '',
      isLoading: true
    };
  }

  componentDidMount() {
    const dbRef = firebase.firestore().collection('THREADS').doc(this.props.route.params.thread)
    dbRef.get().then((res) => {
      if (res.exists) {
        const user = res.data();
        this.setState({
          key: res.id,
          name: user.name,
          latestMessage: {
            createdAt: user.createdAt,
          },
          isLoading: false
        });
      } else {
        console.log("Document does not exist!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateUser() {
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('THREADS').doc(this.state.key);
    // const updateDBRef1 = firebase.firestore().collection('MESSAGES').doc(this.state.key);
    // updateDBRef1.set({

    //   MESSAGES: {
    //     createdAt: new Date().getTime(),
    //     text: `You have joined the room ${this.state.name}.`,
    //     system: true
    //   },
    // });
    updateDBRef.set({

      name: this.state.name,
      latestMessage: {
        createdAt: new Date().getTime(),
        text: `You have joined the room ${this.state.name}.`,
      },
    }).then(docRef => {

      this.setState({
        key: '',
        name: '',
        isLoading: false,
      });
      this.props.navigation.navigate('Home');
    })
      .catch((error) => {
        console.error("Error: ", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  deleteUser() {
    const dbRef = firebase.firestore().collection('THREADS').doc(this.props.route.params.thread)
    dbRef.delete().then((res) => {
      console.log('Item removed from database')
      this.props.navigation.navigate('Home');
    })
  }

  openTwoButtonAlert = () => {
    Alert.alert(
      'Delete Chat Room',
      'Are you sure?',
      [
        { text: 'Yes', onPress: () => this.deleteUser() },
        { text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel' },
      ],
      {
        cancelable: true
      }
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.rootContainer}>
        {/* <View style={styles.closeButtonContainer}>
        <IconButton
          icon='close-circle'
          size={36}
          color='#6646ee'
          onPress={() => navigation.goBack()}
        />
      </View> */}
        <View style={styles.innerContainer}>
          <Title style={styles.title}>Edit name chat room</Title>
          <View style={styles.inputGroup}>
            <FormInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
            />
          </View>
          <View style={styles.button}>
            <FormButton
              title='Update'
              modeValue='contained'
              labelStyle={styles.buttonLabel}
              onPress={() => this.updateUser()}
              disabled={this.state.name.length === 0}
            />
          </View>
          <View>
            <FormButton
              title='Delete'
              modeValue='contained'
              labelStyle={styles.buttonLabel}
              onPress={this.openTwoButtonAlert}
              color="red"
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rootContainer: {
    flex: 1
  },
  // closeButtonContainer: {
  //   position: 'absolute',
  //   top: 30,
  //   right: 0,
  //   zIndex: 1
  // },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15

  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  inputname: {
    fontSize: 22
  },
  button: {
    marginBottom: 7,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10
  },
  buttonLabel: {
    fontSize: 20
  }

})

export default Edit;