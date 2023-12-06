import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Homescreen from './screens/Homescreen'
import Opportunitee from './screens/Opportunites/Opportunitee'


const Stack = createNativeStackNavigator() ;


 
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name="Login" component={Loginscreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={Homescreen} options={{headerShown:false}}/>
        <Stack.Screen name="Opp" component={Opportunitee} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  


export default stacknavigator

const styles = StyleSheet.create({})