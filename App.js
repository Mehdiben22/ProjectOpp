
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Loginscreen from './screens/Loginscreen';
// import Loginscreen from './screens/Loginscreen2';
import Homescreen from './screens/Homescreen'
import Opportunitee from './screens/Opportunites/Opportunitee';
import OpportuniteList from './screens/Opportunites/OpportuniteList';
import DetailsOpp from './screens/Opportunites/DetailsOpp';
// const [oppid,setOppId]=useState()
//     <Stack.Screen name="Login" component={Loginscreen} options={{headerShown:false}}>
//         {props=><OpportuniteList {...props} setOppId={setOppId}/>}
//  </Stack.Screen>

// <Stack.Screen name="Login" component={Loginscreen} options={{headerShown:false}}>
// {props=><DetaillOp {...props} oppId={oppid}/>}
// </Stack.Screen>



const Stack = createNativeStackNavigator() ;
export default function App() {
  const [oppId,setOppId]=useState()


  

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login"> 
      <Stack.Screen name="Login" component={Loginscreen} options={{headerShown:false}}/>
      <Stack.Screen name="Home" component={Homescreen} options={{headerShown:false}}/>
      <Stack.Screen name="Opp" component={Opportunitee} options={{headerShown:true,title:"Ajout opportunité",headerStyle:{backgroundColor:'#5e89af'}}} />
      <Stack.Screen name="Res"   options={{headerShown:true,title:'List Opportunités',headerStyle:{backgroundColor:'#5e89af'}}}>
          {props=><OpportuniteList {...props} setOppId={setOppId}/>}
      </Stack.Screen>

      <Stack.Screen name="DetailOpp"  options={{headerShown:true,title:'Detail Opportunités',headerStyle:{backgroundColor:'#5e89af'}}}>
          {props=><DetailsOpp {...props} oppId={oppId} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
