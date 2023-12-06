import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity , ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Request from '../../common/Request';
//import { Ionicons } from '@expo/vector-icons';
//import { ScrollView } from 'react-native-web';

const OpportuniteList = ({setOppId}) => {
  const [opportunite, setOpportunite] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Add loading state

   useEffect(() => {
    Request('/opportunite/v2/list', 'GET')
      .then(res => {
       // console.log('API response list:', res);
        setOpportunite(res.data.content);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch(error => {
        console.error('Error fetching opportunite list:', error);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.item}>
        <Text>{item.compte.id}</Text>
        
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
   
   // console.log('Item pressed:', item);
    
  };

  
  // console.log('opportunite array:', opportunite);
  
  const handleAjouterOpportunite = () => {
    
    navigation.navigate('Opp');
  };

  return (
   
    <View style={styles.container}>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={opportunite}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          renderItem={({ item }) => (
            <View style={styles.opportuniteItem}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                onStartShouldSetResponder={() => {
                  navigation.navigate('DetailOpp');
                  setOppId(item.id);
                }}
              >
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{item.compte.raisonSociale}</Text> {item.nature.code}{' '}
                  {item.type.code} {item.id}
                </Text>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{item.owner.nomComplet.charAt(0)}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.ajouterButton} onPress={handleAjouterOpportunite}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:50,
    fontSize: 20,   
  },

  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backButton: {
    position: 'relative',
    marginEnd:20,
    top: 10,
    left: 20,
    backgroundColor:'white',
    padding: 10,
    borderRadius: 5,
    width:'7%'
  },
  ajouterButton: {
    display:'flex',
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor:'#3498db',
    padding: 10,
    borderRadius: 50,
    width: 60, 
    height: 60,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    fontSize:30,
  //  padding:20,
  textAlign:'center',
    fontWeight:'700', 
    
   // backgroundColor:'red'
  },
  opportuniteItem: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor:'#BFD0D8'
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of the width and height to create a circle
    backgroundColor: '#3498db', // You can change the background color
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  avatarText: {
    color: 'white', // You can change the text color
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent:'center'
  },
});

export default OpportuniteList;