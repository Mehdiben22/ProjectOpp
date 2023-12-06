import React from 'react';
import { StyleSheet, Text, View, Pressable,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

const Homescreen = () => {
  const navigation = useNavigation();
  

  return (
    <View style={styles.container}>
      {/* En-tête avec fond bleu */}
      <View style={styles.header}>
        <View style={{flexDirection:'row',alignContent:'center',marginTop:15}}>
      <Image style={{width:55,height:30,marginRight:500}} source={require('../assets/BeeSpace_logo.png')}/>
      <Feather name="menu" size={24} color="black" />
      </View>
      </View>
      <View style={{marginBottom:10}}>
      <Text style={styles.headerText}>Welcome to beespace</Text>
      </View>
      {/* Case Opportunité au centre de la page */}
      <View style={styles.centeredContainer}> 
        <Pressable 
          onPress={() => navigation.navigate('Res')}
          style={styles.opportunityBox}
        >
          <Image style={{width:70,height:70 , margin:15 , justifyContent:'center'}} source={require('../assets/connaissances.png')}/>
          <Text style={{ fontWeight: 'bold' , justifyContent:'center' }}>Opportunité</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor : 'gray',
    
  },
  header: {
    backgroundColor: '#5e89af',
    padding: 25,
    width: '100%',
    alignItems: 'center',
    
    
  
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  //  backgroundColor : 'blue'
  },
  opportunityBox: {
    backgroundColor: 'white',
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
   // backgroundColor : 'red'
  },
});

export default Homescreen;
