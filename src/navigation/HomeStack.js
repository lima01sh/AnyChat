import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import Edit_Delete_Room_Screen from '../screens/Edit_Delete_Room_Screen';
import { AuthContext } from './AuthProvider';
import Edit from '../screens/Edit';
import Edit_modal from '../screens/Edit_modal';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

/**
 * All chat app related screens
 */

function ChatApp() {
  const { logout } = useContext(AuthContext);

  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff5722'
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontSize: 20
        },
      }}
    >
      <ChatAppStack.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection:"row" }}>
              <IconButton
                icon='card-account-details'
                size={28}
                color='#000000'
                onPress={() => {}}
              />
              <IconButton
                icon='account-group'
                size={28}
                color='#000000'
                onPress={() => {}}
              />
              <IconButton
                icon='message-plus'
                size={28}
                color='#000000'
                onPress={() => navigation.navigate('AddRoom')}
              />
              
            </View>
          ),
          headerLeft: () => (
            <IconButton
              icon='logout-variant'
              size={28}
              color='#000000'
              onPress={() => logout()}
            />
          )
        })}
      />
      <ChatAppStack.Screen
        name='Room'
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.thread.name
        })}
        // name='Edit'
        // component={ Edit}
        // options={{ title: 'User Detail'}}
      />
      <ChatAppStack.Screen
        name='Edit'
        component={Edit}
        options={({ route }) => ({
          title: route.params.thread.name
        })}
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator screenOptions={{ presentation:"modal", headerShown:false }}>
      <ModalStack.Screen name='ChatApp' component={ChatApp} />
      <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
      {/* <ModalStack.Screen name='Edit_Delete_Room_Screen' component={Edit_Delete_Room_Screen} /> */}
      {/* <ModalStack.Screen name='Edit' component={Edit} /> */}
    </ModalStack.Navigator>
  );
}