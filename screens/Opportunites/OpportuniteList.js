import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity , ActivityIndicator , Modal , Pressable , ToastAndroid ,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Request from '../../common/Request';
//import { Ionicons } from '@expo/vector-icons';
//import { ScrollView } from 'react-native-web';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//  import { ListItem } from 'react-native-elements';





const OpportuniteList = ({setOppId}) => {
  const [opportunite, setOpportunite] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Add loading state
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const showModificationSuccessMessage = () => {
    console.log('ToastAndroid:', ToastAndroid);
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Suppression effectué ! ',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };





  


   useEffect(() => {
    Request('/opportunite/v2/list', 'GET')
    .then(res => res.json())
      .then(res => {
        console.log('API response list:', res.content);
        setOpportunite(res.content);
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

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Effectuez la requête pour actualiser les données ici
    Request('/opportunite/v2/list', 'GET')
      .then(res => res.json())
      .then(res => {
        console.log('API response list:', res.content);
        setOpportunite(res.content);
        setRefreshing(false);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch(error => {
        console.error('Error fetching opportunite list:', error);
        setRefreshing(false);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  };



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

  const handleDeletePress = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  const handleCancelDelete = () => {
    setShowModal(false);
  };
  // console.log('opportunite array:', opportunite);
  const handleConfirmDelete = () => {
    Request(`/opportunite/delete/${selectedItem.id}`, 'POST')
      .then(response => {
        console.log('Raw API response:', response);
        
        if (response.status === 200 ) {showModificationSuccessMessage();}
        else {
               console.error('Modification erreur:', response.status);
             //  console.error('Response body:', response.data);
             }
      
        setOpportunite(prevOpportunite => prevOpportunite.filter(item => item.id !== selectedItem.id));
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error deleting opportunity:', error);
        setShowModal(false);
      });
  };
  




  const handleAjouterOpportunite = () => {
    
    navigation.navigate('Opp');
  };

  return (
   
   
    <View style={styles.container}>
      <View style={{left:570}}>
        <View style={{flexDirection:'row' , alignItems:'center'}}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <SimpleLineIcons name="reload" size={24} color="black" />
    </TouchableOpacity>
    <View style={{flexDirection:'row' ,alignItems:'center'}}>
    <View style={styles.standByContainer}>
    </View>
    </View>
    <View>
          <Text style={styles.standByText}>Stand By</Text>
          </View>
          </View>
    </View>
      {loading || refreshing ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loadingIndicator} />
      ) : (
        
        <FlatList
          data={opportunite}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          
          renderItem={({ item }) => (
            
            <View style={[
              styles.opportuniteItem,
              { backgroundColor: item.standBy ? 'lightgray' : '#BFD0D8' },
            ]}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' ,alignItems:'center' }}
                
              >
                
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{item.owner?item.owner.nomComplet:''}</Text> {item.compte?item.compte.raisonSociale:''}{' '}
                  {item.type.code} {item.id}
                </Text>
              
                
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <View onStartShouldSetResponder={() => {
                  navigation.navigate('DetailOpp');
                  setOppId(item.id);
                }} style={styles.avatarContainer}>
               
                 <Text style={styles.avatarText}>
  {item.owner ? item.owner.nomComplet.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
</Text>

               
                </View>
                <AntDesign name="delete" size={24} color="black" onPress={() => handleDeletePress(item)} />
                </View>
              
              </View>
              </View>
            
           
            
            
          )}
        />
      )}
      <TouchableOpacity style={styles.ajouterButton} onPress={handleAjouterOpportunite}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Voulez-vous vraiment supprimer cette opportunité ?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Pressable style={[styles.modalButton, { backgroundColor: '#5e89af' }]} onPress={handleCancelDelete}>
                <Text style={{color:'white'}}>Annuler</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: '#5e89af' }]} onPress={handleConfirmDelete}>
                <Text style={{color:'white'}} >Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:10,
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
  refreshButton: {
    // position: 'absolute',
    // top: 1,
    right: 10,
    backgroundColor: '#5e89af',
    padding: 2,
    borderRadius: 5,
    width:30,
    marginEnd:10
  },
  opportuniteItem: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // backgroundColor: item => (item.standBy ? 'lightgray' : '#BFD0D8')
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
    fontSize: 8,
    fontWeight: 'bold',
    justifyContent:'center',
    textAlign:'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    
  },
  standByContainer: {
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 2,
    borderWidth:1,
    right:600,
    width:'3%'
  },
  standByText: {
    fontSize: 12,
     fontWeight: 'bold',
    right: 598
  },
});

export default OpportuniteList;