import React , {useState,useEffect} from 'react';
import { StyleSheet, Text, View, Pressable,Image,Modal,TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Request from '../common/Request';


import { Feather } from '@expo/vector-icons';


const Homescreen = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [ressource, setRessource] = useState(false);
 
  
  useEffect(() => {
    Request('/ressource/current-user', 'GET')
    .then(res => res.json())
      .then(res => {
        console.log('API response list:', res);
        setRessource(res.nomComplet);
       
      })
      .catch(error => {
        console.error('Error fetching ressource user:', error);
        
      });
  }, []);


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    navigation.navigate('Login')
  };

  return (
    <View style={styles.container}>
      {/* En-tête avec fond bleu */}
      <View style={styles.header}>
        <View style={{flexDirection:'row',alignContent:'center',marginTop:15}}>
      <Image style={{width:55,height:30,marginRight:500}} source={require('../assets/BeeSpace_logo.png')}/>
      
      <Pressable onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </Pressable>
      </View>
      </View>
      <View style={{marginBottom:10}}>
      <Text style={styles.headerText}>Welcome to beespace {ressource && ` - ${ressource}`} </Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => {
          toggleMenu();
        }}
      >
         <View style={styles.modalContainer}>
          <View style={styles.menuOptionsContainer}>
            <View style={styles.menuOptions}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutText}>Déconnexion</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleMenu}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Aligner en bas de l'écran
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent pour un aspect modal
  },
  menuOptionsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // Masquer tout contenu qui dépasse les coins arrondis
  },
  menuOptions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
   
  },
  cancelText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Homescreen;
