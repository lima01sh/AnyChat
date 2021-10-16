
import React, { useState, useEffect, Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import useStatsBar from '../utils/useStatusBar';
import { ThemeProvider, Button, Input, Image } from 'react-native-elements'

// deleteUser() {
//   const dbRef = firebase.firestore().collection('react-native-crud').doc(this.props.route.params.userKey);
//   dbRef.delete().then((res) => {
//       console.log("Item removed from database");
//       this.props.navigation.navigate('UserScreen');
//   })
// }
// openTwoButtonAlert = () => {
//   Alert.alert(
//       'Delete User',
//       'Are you sure?',
//       [
//           {text: 'Yes', onPress: () => this.deleteUser()},
//           {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'}
//       ],
//       {
//           cancelable: true
//       }
//   )
// }
export default function Edit_Delete_Room_Screen({ navigation }) {
  useStatsBar('dark-content');
  const [EroomName, setEroomName] = useState('');
 
 
   const [threads, setThreads] = useState([]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data()
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);
  // if (loading) {
  //   return <Loading />;
  // }

//   function openTwoButtonAlert ()  {
//     Alert.alert(
//         'Delete User',
//         'Are you sure?',
//         [
//             {text: 'Yes', onPress: () => this.deleteUser()},
//             {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'}
//         ],
//         {
//             cancelable: true
//         }
//     )
// }

  function handleButtonPress() {
    if (EroomName.length > 0) {
      firestore()
        .collection('THREADS')
        .add({
          name: EroomName,
          latestMessage: {
            text: `You have joined the room ${EroomName}.`,
            createdAt: new Date().getTime()
          }
        })
        .then(docRef => {
          docRef.collection('MESSAGES').add({
            text: `You have joined the room ${EroomName}.`,
            createdAt: new Date().getTime(),
            system: true
          });
          navigation.navigate('Home');
        });
    }
  }
  
  
  return (
   
    <View style={styles.rootContainer}>
      
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon='close-circle'
          size={36}
          color='#6646ee'
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}>Editt name chat room</Title>
        <FormInput
          labelName='Room Name'
          value={EroomName}
          onChangeText={text => setEroomName(text)}
          clearButtonMode='while-editing'
        />
        <FormButton
          title='Update'
          modeValue='contained'
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={EroomName.length === 0}
        />
        <FormButton
          title='Delete'
          modeValue='contained'
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          buttonStyle={{
            backgroundColor: "red"
         }}
          // disabled={EroomName.length === 0}
          
        />

         {/* <FormButton 
            icon={
                 <Icon 
                 name="trash"
                 size={15}
                 color="#fff"
                   />
                            }
                 title='  Delete'
                 containerStyle={{
                 marginTop: 10
                 }}
                 buttonStyle={{
                backgroundColor: "red"
                            }}
                  onPress={this.openTwoButtonAlert}
          /> */}
      </View>
    </View>
    
    
    
  );
  
}

const theme = {
  Button: {
      raised: true
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  buttonLabel: {
    fontSize: 22
  }
});
