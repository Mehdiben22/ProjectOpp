import React, { useEffect, useState , useCallback   } from 'react';
import { View, Text, TextInput, Button, ScrollView ,TouchableOpacity , Modal , ToastAndroid , ActivityIndicator  } from 'react-native';
import { Formik } from 'formik';
import CommentSystem from './Commentaire';
import Request from '../../common/Request';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import MultiSelect from 'react-native-multiple-select';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { URL_API } from '../../common/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useFormikContext } from 'formik';


const DetailsOpp = ({ oppId }) => {
  const [item,setItem]=useState();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comptes , setComptes] = useState([]);
const [natures , setNatures] = useState([]);
const [types , setTypes] = useState([]);
const [niveau , setNiveau] = useState([]);
const [buList,setBulist]=useState([])
const [busSelected,setBusSelected]=useState([])
const [dateRemise, setDateRemise] = useState(new Date()); // Separate state for Date Remise
const [dateClosing, setDateClosing] = useState(new Date()); // Separate state for Date Closing
const [showRemise, setShowRemise] = useState(false);
const [modeRemise, setModeRemise] = useState('date');
const [showClosing, setShowClosing] = useState(false);
const [modeClosing, setModeClosing] = useState('date');
const [selectedBuItems, setSelectedBuItems] = useState([]);
  const [busDetail,setBusDetail]=useState([{}])
const [commentSystemVisible, setCommentSystemVisible] = useState(false);
const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [iconName, setIconName] = useState('down');
  const [currentUser, setCurrentUser] = useState(null);
  const [reslistres, setReslistres] = useState(null);
  const [ressourcelist, setRessourcelist] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [approvalConfirmationModalVisible, setApprovalConfirmationModalVisible] = useState(false);
  const [ownerChangeModalVisible, setOwnerChangeModalVisible] = useState(false);
  const [newOwner, setNewOwner] = useState('');
  const [selectedNewOwner, setSelectedNewOwner] = useState('');
  const [selectedNewOwnercompte, setSelectedNewOwnercompte] = useState('');
  
  const [opportuniteid, setOpportuniteid] = useState(null);
  const [ownerCompteModalVisible, setOwnerCompteModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [switchValuee, setSwitchValuee] = useState(false);
   const [switchValueee, setSwitchValueee] = useState( false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
const [selectedStatus, setSelectedStatus] = useState('');
const [comment, setComment] = useState('');
const [demandeRessourceSuccess, setDemandeRessourceSuccess] = useState(false);
const [demandeApprobSuccess, setDemandeApprobSuccess] = useState(false);
const [key, setKey] = useState(0);




function isEqualArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

  // const [loading, setLoading] = useState(true); // Add loading state
 
  const formatDateTime = (isoDate) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(isoDate));
  };


  // const demandeRessourceButtonStyle = opportuniteid.demandeRessource
  // ? { backgroundColor: 'green', padding: 10, borderRadius: 8, margin: 5 }
  // : { backgroundColor: 'lightgray', padding: 10, borderRadius: 8, margin: 5 };

  const handleApprobationPress = () => {
    setApprovalModalVisible(true);
  };

  const handleApprobationCancel = () => {
    setApprovalModalVisible(false);
  };

  const showModificationSuccessMessage = () => {
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Modification effectuée avec succès',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };

  const showModificationressource = () => {
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Demande de ressource envoyé ! ',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };

  const showModificationapprobation = () => {
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Demande dapprobation envoyé !',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };
  const showModificationstandby = () => {
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Opportunité mise à jour avec succès',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };





  
  const onCommentChange = (text) => {
    setComment(text);
  };
 
  




  
// Function to handle the "Demande de ressource" button press
const handleDemandeDeRessourcePress = () => {
  
    setConfirmationModalVisible(true);
  
};


// Function to handle the confirmation modal cancel
const handleModalCancel = () => {
  // Hide the confirmation modal
  setConfirmationModalVisible(false);
  setApprovalConfirmationModalVisible(false);
};


// Function to handle the confirmation modal confirm
// Inside your handleModalConfirm function
const handleModalConfirm = () => {
  // Hide the confirmation modal
  setConfirmationModalVisible(false);

  // Prepare the payload for the API call
  const requestData = new FormData();
  requestData.append("demandeRessource", true); // You can adjust the value based on your requirement

  // Make the API call to opportunite/update/demandeRessource/OppId
  Request(`/opportunite/update/demandeRessource/${oppId}`, 'POST', requestData)
  .then(response => {
    if (response.status === 200) {
      showModificationressource();

      // Update the button style or perform any other actions
      // For example, you can set a state variable to track the success status
      // and use it to conditionally style the button
      // Update the button style based on the success status
      // For example, set a state variable to track the success status
      // setDemandeRessourceSuccess(true);
      setDemandeRessourceSuccess(true);
    } else {
      console.error('Modification erreur:', response.status);
      // You can handle the error or display a message to the user
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the network error here, you can log it or display a message to the user
  });
};

const handleModalApprobConfirm = () => {
  // Hide the confirmation modal
  setApprovalConfirmationModalVisible(false);

  // Prepare the payload for the API call
  const requestData = new FormData();
  requestData.append("demandeApprobation", true); // You can adjust the value based on your requirement

  // Make the API call to opportunite/update/demandeRessource/OppId
  Request(`/opportunite/update/demandeApprobation/${oppId}`, 'POST', requestData)
  .then(response => {
    if (response.status === 200) {
      showModificationapprobation();

      // Update the button style or perform any other actions
      // For example, you can set a state variable to track the success status
      // and use it to conditionally style the button
      // Update the button style based on the success status
      // For example, set a state variable to track the success status
      // setDemandeRessourceSuccess(true);
      setDemandeApprobSuccess(true);
    } else {
      console.error('Modification erreur:', response.status);
      // You can handle the error or display a message to the user
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the network error here, you can log it or display a message to the user
  });
};







  // Function to handle the "Demande d'approbation" button press
  const handleDemandeDApprobationPress = () => {
    // Show the confirmation modal for "Demande d'approbation"
    setApprovalConfirmationModalVisible(true);
  };


  

  const handleChangerOwnerPress = () => {
    // Show the owner change modal
    setOwnerChangeModalVisible(true);
  };

  const handleOwnerChangeCancel = () => {
    // Hide the owner change modal
    setOwnerChangeModalVisible(false);
  };

  const handleOwnerChangeConfirm = () => {
    // Perform the necessary actions when "Ok" is pressed for owner change
    // For example, update the owner of the opportunity
    // ...

    // Hide the owner change modal
    setOwnerChangeModalVisible(false);
  };



  const handleOwnerComptepress = () => {
    // Show the owner change modal
    setOwnerCompteModalVisible(true);
  };

  const handleOwnerComptecancel = () => {
    // Hide the owner change modal
    setOwnerCompteModalVisible(false);
  };

  const handleOwnerCompteConfirm = () => {
    // Perform the necessary actions when "Ok" is pressed for owner change
    // For example, update the owner of the opportunity
    // ...

    // Hide the owner change modal
    setOwnerCompteModalVisible(false);
  };

  const handleStandByToggle = () => {
    const newStandByStatus = !switchValueee;
  
    const requestData = new FormData();
    requestData.append("standBy", newStandByStatus);
  
    Request(`/opportunite/update/standBy/${oppId}`, 'POST', requestData)
      .then(response => {
        if (response.status === 200) {
          // Update the Switch value based on the success of the API call
          setSwitchValueee(newStandByStatus);
          showModificationstandby(); // Show success message
        } else {
          console.error('Modification erreur:', response.status);
          // Handle the error or display a message to the user
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the network error here, you can log it or display a message to the user
      });
  };
  

  const handleStandByconsultation = () => {
    const newconsultationStatus = !switchValue;
  
    const requestData = new FormData();
    requestData.append("consultationRecue", newconsultationStatus);
  
    Request(`/opportunite/update/consultationRecue/${oppId}`, 'POST', requestData)
      .then(response => {
        if (response.status === 200) {
          // Update the Switch value based on the success of the API call
          setSwitchValue(newconsultationStatus);
          showModificationstandby(); // Show success message
        } else {
          console.error('Modification erreur:', response.status);
          // Handle the error or display a message to the user
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the network error here, you can log it or display a message to the user
      });
  };
  
  const handleStandByoffrremise = () => {
    const newoffreremiseStatus = !switchValuee;
    let newconsultationStatus; // Declare newconsultationStatus variable
  
    // Update "Offre remise" switch status
    const requestDataOffreRemise = new FormData();
    requestDataOffreRemise.append("offreRemise", newoffreremiseStatus);
  
    Request(`/opportunite/update/offreRemise/${oppId}`, 'POST', requestDataOffreRemise)
      .then(response => {
        if (response.status === 200) {
          // Update the Switch value based on the success of the API call
          setSwitchValuee(newoffreremiseStatus);
          showModificationstandby(); // Show success message
  
          // If "Offre remise" switch is turned on, also turn on "Consultation reçu" switch
          if (newoffreremiseStatus) {
            newconsultationStatus = true; // Assign a value to newconsultationStatus
            const requestDataConsultation = new FormData();
            requestDataConsultation.append("consultationRecue", newconsultationStatus);
  
            return Request(`/opportunite/update/consultationRecue/${oppId}`, 'POST', requestDataConsultation);
          }
        } else {
          console.error('Modification erreur:', response.status);
          // Handle the error or display a message to the user
        }
      })
      .then(responseConsultation => {
        if (responseConsultation && responseConsultation.status === 200) {
          // Update the "Consultation reçu" switch value based on the success of the API call
          setSwitchValue(newconsultationStatus);
          showModificationstandby(); // Show success message
        } else if (responseConsultation) {
          console.error('Consultation erreur:', responseConsultation.status);
          // Handle the error or display a message to the user
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the network error here, you can log it or display a message to the user
      });
  };
  




  const toggleAdditionalText = () => {
    setShowAdditionalText(!showAdditionalText);
    setIconName(showAdditionalText ? 'down' : 'up');
  };


  

  const onChangeRemise = (event, selectedDate) => {
    // const currentDate = selectedDate || dateRemise;
    setShowRemise(false);
    setDateRemise(new Date(selectedDate) || dateRemise );
  };

  const onChangeClosing = (event, selectedDate) => {
    //  const currentDate = selectedDate || dateClosing;
    setShowClosing(false);
    setDateClosing(new Date(selectedDate) || dateClosing );
  };

const showDatepicker = (type) => {
  let selectedDate, selectedMode, setShow ;

  if (type === 'remise') {
    selectedDate = dateRemise;
    selectedMode = modeRemise;
    setShow = setShowRemise;
    //  setDate = setDateRemise;
  } else if (type === 'closing') {
    selectedDate = dateClosing;
    selectedMode = modeClosing;
    setShow = setShowClosing;
    //  setDate = setDateClosing;
  }

  setShow(true);
  if (selectedMode === 'date') {
    setModeRemise('date');
    setModeClosing('date');
  } else {
    setModeRemise('time');
    setModeClosing('time');
  }
  //  setDate(selectedDate); // Set the date value based on the type
};

  useEffect(() => {
    setLoading(true);
    Request('/opportunite/get/'+oppId,'get')
    .then(res => res.json())
        .then(res=> {
          setItem(res);
          const busList=[]
          const buListNoUpdated=[]
          if(res && res.busConcernes){
            res.busConcernes.forEach(element => {
              buListNoUpdated.push({
                id:element.id
              })
              busList.push(element.id) 
            }); 
            setDateRemise(new Date(res.dateRemise))
            setDateClosing(new Date(res.dateClosing))
            setBusDetail(busList)
            setBusSelected(buListNoUpdated)
          }
          
        } )
        .catch(error => console.error('error nature opportunite :', error));

        Request('/compte/list/select','GET')
         .then(res =>res.json())
        .then(res=> {
            const data=res.map(e=> { return { title:e.raisonSociale,id:e.code}})
            setComptes(data);

        } )
        .catch(error => console.error('error compte list :', error));

        Request('/nature-opportunite/list/select','get')
        .then(res =>res.json())
        .then(res=> {
          
            setNatures(res);
        } )
        .catch(error => console.error('error nature opportunite :', error));

        Request('/type-opportunite/list/select','get')
        .then(res =>res.json())
        .then(res=> {
//console.log('API reponse :',res);
            setTypes(res);
        } )
        .catch(error => console.error('error types list :', error));

        Request('/niveau-engagement/list/select','get')
        .then(res =>res.json())
        .then(res=> {
           // console.log('API reponse :',res);
            setNiveau(res);
        } )
        .catch(error => console.error('error Niveau engagement :', error));

    
        Request('/bu/list/select','get')
        .then(res =>res.json())
        .then(res=> {
          //console.log('API reponse :',res);
          
            setBulist(res);
        } )
        .catch(error => console.error('error Bu List :', error));

        Request('/ressource/current-user', 'GET')
        .then(res => res.json())
          .then(res => {
            setCurrentUser(res);
           
          })
          .catch(error => {
            console.error('Error fetching ressource user:', error);
            
          });

          Request('/ressource/list-ressources-opp', 'GET')
        .then(res => res.json())
          .then(res => {
            setReslistres(res);
           
          })
          .catch(error => {
            console.error('Error fetching ressource listopp:', error);
            
          })


          Request('/ressource/list', 'GET')
        .then(res => res.json())
          .then(res => {
            setRessourcelist(res);
           
          })
          .catch(error => {
            console.error('Error fetching ressource list:', error);
            
          })
           
          Request('/statut-approbation-opportunite/list', 'GET')
        .then(res => res.json())
          .then(res => {
            
            setSelectedStatus(res);
           
          })
          .catch(error => {
            console.error('Error fetching ressource listopp:', error);
            
          })


          Request(`/opportunite/get/${oppId}`, 'GET')
        .then(res => res.json())
          .then(res => {
            
            setOpportuniteid(res);
            setSwitchValueee(res.standBy);
            setSwitchValue(res.consultationRecue);
            setSwitchValuee(res.offreRemise)
          })
          .catch(error => {
            console.error('Error fetching opp list:', error);
            
          })




          .finally(() => {
            // Set loading to false when loading is complete
            setLoading(false);
          });
  }, []);

  const handleSubmit =  (values) => {
    try {
     
      // values["busConcernes"]=busSelected
      values["busConcernes"]=busSelected
        // // Format dateClosing to ISO string
        // values.dateClosing = new Date(values.dateClosing).toISOString().toString();
        // values.dateRemise = new Date(values.dateRemise).toISOString().toString();
        // // Format dateRemise as needed
        //    const dateRemise = new Date(values.dateRemise);
        //    const formattedDateRemise = `${dateRemise.getFullYear()}-${(dateRemise.getMonth() + 1).toString().padStart(2, '0')}-${dateRemise.getDate().toString().padStart(2, '0')}`;
        //    values.dateRemise = formattedDateRemise;
  

    Request('/opportunite/update/'+oppId, 'POST', values )
    .then(response =>{
    //   if (response.status === 200 ) {
    //     console.log('Opportunity Updated successfully!');
    //     navigation.navigate('Res', values);
    //   } else {
    //     console.error('Unexpected status code:', response.status);
    //   //  console.error('Response body:', response.data);
    //   }
    // })
    // .then(res => res.json())
    if (response.status === 200 ) {showModificationSuccessMessage();}
    else {
           console.error('Modification erreur:', response.status);
         //  console.error('Response body:', response.data);
         }
    })
    
   
    } catch (error) {
      console.error('Error editing opportunity:', error);
  
    }
  };
  
  
  const toggleCommentSystem = () => {
    setCommentSystemVisible(!commentSystemVisible);
  };

  const closeCommentSystem = () => {
    setCommentSystemVisible(false);
  };


  return (
    
    <View style={{ flex: 1, height: '80%' }}>
       
     {/* Display loading indicator if loading is true */}
     {loading && <ActivityIndicator size="large" color="#3498db" style={{flex: 1,
    justifyContent: 'center',
    alignItems: 'center',}} />}
    <View style={{ marginLeft: 570 }}>
      <AntDesign name={iconName} size={24} color="black" onPress={toggleAdditionalText} />
    </View>
    
    {showAdditionalText && (
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-around' , marginRight:90}}>
             
              <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:'bold'}}>Propriétaire : </Text>
              <Text style={{ color: 'blue', textDecorationLine: 'underline'}}>
           {currentUser ? currentUser.nomComplet : ''}
            </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:'bold'}}>Identifiant : </Text>
              <Text style={{ color: 'blue', textDecorationLine: 'underline'}}>{item.identifiant}</Text>
              </View>
              
            </View>
            <View style={{flexDirection:'row',marginLeft:40}}>
              <Text style={{fontWeight:'bold'}}>Compte :  </Text>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
        {item.compte.raisonSociale}
      </Text>
      
      </View>
      <View>
      <View style={{marginLeft:30,padding:15 , flexDirection:'row',justifyContent:'space-between'}}> 
      <Text style={{color:'gray'}}>Créé le: {`${formatDateTime(opportuniteid.createdDate)}`}</Text>
      <Text style={{color:'gray'}}>Modifié le:{`${formatDateTime(opportuniteid.lastModifiedDate)}`}</Text>
      </View>
      <View style={{marginLeft:45}}>
      <Text style={{color:'gray'}}>Par:{opportuniteid.createdBy}</Text>
      </View>
      </View>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
         
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>  
          <TouchableOpacity
      style={{
        backgroundColor: demandeRessourceSuccess ? 'green' : (opportuniteid && opportuniteid.demandeRessource ? 'green' : 'lightgray'),
        padding: 10,
        borderRadius: 8,
        margin: 5,
      }}
      onPress={handleDemandeDeRessourcePress}
      disabled={switchValueee} 
    >
         <View style={{alignItems:'center'}}>
         <AntDesign  name="user" size={24} color="black" />
         </View>
         <Text>Demande de ressource</Text>
         </TouchableOpacity>
         
         <Modal 
        visible={confirmationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalCancel}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>
              {opportuniteid.demandeRessource?"Une demande de ressource a déjà été envoyée. Souhaitez-vous en envoyer une nouvelle ?":"Voulez-vous envoyer une demande de ressource ? "}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 ,justifyContent:'space-evenly' }}>
              <Button color="#5e89af"  title="Annuler" onPress={handleModalCancel} />
              <Button color="#5e89af" title="Ok" onPress={handleModalConfirm} />
            </View>
          </View>
        </View>
      </Modal>
         
         <TouchableOpacity  style={{
        backgroundColor: demandeApprobSuccess? 'green' :(opportuniteid && opportuniteid.demandeApprobation ? 'green' : 'lightgray'),
        padding: 10,
        borderRadius: 8,
        margin: 5,
      }}onPress={handleDemandeDApprobationPress}
      disabled={switchValueee} >
          <View style={{alignItems:'center'}}> 
         <AntDesign name="solution1" size={24} color="black" />
         </View>
         <Text>Demande d'approbation</Text>
         </TouchableOpacity>
         <Modal
        visible={approvalConfirmationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalCancel}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>
              {opportuniteid.demandeApprobation?"Une demande d'approbation a déjà été envoyée. Souhaitez-vous en envoyer une nouvelle ?":"Voulez-vous envoyer une demande d'approbation ? "}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 ,justifyContent:'space-evenly' }}>
              <Button color="#5e89af"  title="Annuler" onPress={handleModalCancel} />
              <Button color="#5e89af" title="Ok" onPress={handleModalApprobConfirm} />
            </View>
          </View>
        </View>
      </Modal>
         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}} onPress={handleApprobationPress}
          disabled={switchValueee}  >
          <View style={{alignItems:'center'}}>
         <AntDesign name="questioncircleo" size={24} color="black" />
         </View>
         <Text>Approbation</Text>
         </TouchableOpacity>
         <Modal
        visible={approvalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleApprobationCancel}

      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}>
          
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 ,width:'80%' }}>
           
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Approbation Opportunité</Text>
           
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text>Statut: </Text>
              
              <Picker
              style={{
                backgroundColor: 'lightgray',
                marginVertical: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 15,
                width:'50%',
                
                
              }}
              selectedValue={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
               <Picker.Item label="" value="" />
              {selectedStatus.map((res) => (
                <Picker.Item key={res.code} label={res.code} value={res.code} />
              ))}
            </Picker>
          
            </View>
            <View>
            <Text>Commentaires:</Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                marginVertical: 10,
                 padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                // borderRadius: 15,
                height:100
              }}
              value={comment}
              onChangeText={(text) => onCommentChange(text)}
              multiline
            />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly' }}>
              <Button color="#5e89af" title="Annuler" onPress={handleApprobationCancel} />
              <Button color="#5e89af" title="Ok" onPress={handleOwnerChangeConfirm} />
            </View>
          </View>
        </View>
      </Modal>
         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}}  disabled={switchValueee}  >
          <View style={{alignItems:'center'}}>
         <AntDesign name="lock1" size={24} color="black" />
         </View>
         <Text>Cloturer</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}}>
          <View style={{alignItems:'center'}}>
         <AntDesign name="mail" size={24} color="black" />
         <Text>Email</Text>
         </View>
         </TouchableOpacity>
         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}} onPress={handleChangerOwnerPress}
          disabled={switchValueee} >
          <View style={{alignItems:'center'}}>
         <Feather name="users" size={24} color="black" />
         </View>
         <Text>Changer owner Opportunité</Text>
         </TouchableOpacity>
         <Modal
        visible={ownerChangeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleOwnerChangeCancel}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 ,width:'80%' }}>
            <View style={{}}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Changement owner opprotunité</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text>Actuel owner: </Text>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                {currentUser ? currentUser.nomComplet : ''}
              </Text>
            </View>
            <View style={{flexDirection:'row' ,alignItems:'center'}}>
            <Text>Nouvel Owner:</Text>
            
              <Picker
                 style={{
                 backgroundColor: 'lightgray',
                marginVertical: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 15,
                width:'80%'
                }}
                 selectedValue={selectedNewOwner}
                 onValueChange={(value) => setSelectedNewOwner(value)}
              >
                 <Picker.Item label="" value="" />
             {reslistres.map((res) => (
             <Picker.Item key={res.id} label={res.nomComplet} value={res.id} />
              ))}
            </Picker>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly' }}>
              <Button color="#5e89af" title="Annuler" onPress={handleOwnerChangeCancel} />
              <Button color="#5e89af" title="Ok" onPress={handleOwnerChangeConfirm} />
            </View>
          </View>
        </View>
      </Modal>

         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}} onPress={handleOwnerComptepress}  
          disabled={switchValueee} >
          <View style={{alignItems:'center'}}>
         <AntDesign name="swap" size={24} color="black" />
         <Text>Changer owner du compte</Text>
         </View>
         </TouchableOpacity>
         <Modal
        visible={ownerCompteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleOwnerComptecancel}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 ,width:'80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Changement owner Compte</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text>Nouvel Owner: </Text>
              <Picker
                 style={{
                 backgroundColor: 'lightgray',
                marginVertical: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 15,
                width:'70%'
                }}
                 selectedValue={selectedNewOwnercompte}
                 onValueChange={(value) => setSelectedNewOwnercompte(value)}
              >
                 <Picker.Item label="" value="" />
             {ressourcelist.map((res) => (
             <Picker.Item key={res.id} label={res.nomComplet} value={res.id} />
              ))}
            </Picker>
            </View>
            <View> 
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly' }}>
              <Button color="#5e89af" title="Annuler" onPress={handleOwnerComptecancel} />
              <Button color="#5e89af" title="Ok" onPress={handleOwnerCompteConfirm} />
            </View>
          </View>
        </View>
      </Modal>
         <TouchableOpacity style={{backgroundColor:'lightgray',padding: 10, borderRadius: 8, margin: 5}}  disabled={switchValueee}  >
          <View style={{alignItems:'center'}}>
         <AntDesign name="filetext1" size={24} color="black" />
         <Text>Evaluation opportunité</Text>
         </View>
         </TouchableOpacity>
         </ScrollView>
       </View>
       <View style={{flexDirection:'row' ,alignItems:'center',justifyContent:'space-around'}} >
        <View style={{flexDirection:'row',alignItems:'center',textAlign:'center'}}>
        <Text>Consultation reçu</Text>
        <Switch
        thumbColor='#FFF'
        trackColor={{true: 'green', false: 'grey'}}
         value={switchValue}
         onValueChange={handleStandByconsultation}
         disabled={switchValueee} 
         />
         </View>
         <View style={{flexDirection:'row',alignItems:'center',textAlign:'center'}}>
        <Text>Offre remise</Text>
        <Switch
        trackColor={{true: 'green', false: 'grey'}}
        thumbColor='#FFF'
         value={switchValuee}
         onValueChange={handleStandByoffrremise}
         disabled={switchValueee} 
         />
         </View>
         <View style={{flexDirection:'row',alignItems:'center',textAlign:'center'}}>
        <Text>Stand by</Text>
        <Switch
        thumbColor='#FFF'
        trackColor={{true: 'orange', false: 'grey'}}
         value={switchValueee}
         onValueChange={handleStandByToggle}
         />
         </View>
       </View>
       </View>
   
      
   
      )}
      
      {
        
        item ? 
        
        <ScrollView style={{height:'20%',backgroundColor:'#BFD0D8'}}>
         
        <Formik 
        initialValues={{
          compte: item.compte.code?{code:item.compte.code}:{code:''},
         // busConcernes: busSelected ,
          sujet: item.sujet?item.sujet:'',
          description: item.description?item.description:'' ,
          nature: item.nature.code?{code:item.nature.code}:{code:''},
          type: item.type.code?{code:item.type.code}:{code:''},
          busConcernes: item.busConcernes || [],
          niveauEngagement: item.niveauEngagement.code?{code:item.niveauEngagement.code}:{code:''},
          dateRemise: item.dateRemise ? new Date(item.dateRemise) : new Date(),
          dateClosing: item.dateClosing ? new Date(item.dateClosing) : new Date(),
          rdvEtabli: item.rdvEtabli,
          caEstime: item.caEstime ? item.caEstime.toString() : '', // Updated here
          margeEstimee : item.margeEstimee ? item.margeEstimee.toString() : '' ,
          pctgMargeEstimee: item.pctgMargeEstimee ? item.pctgMargeEstimee.toString() : '', // Updated here 
          weekPlaning: item.weekPlaning || '',
          risques: item.risques || '',
          pointsForts: item.pointsForts || '',
          //  owner :{
          //          id: item.owner.id
          //         },
         

          }}
          onSubmit={ (values, actions) => {
             values.dateRemise = moment(dateRemise).toISOString();
             values.dateClosing = moment(dateClosing).toISOString();

            // values.dateRemise = moment(dateRemise).toISOString();
            // values.dateClosing =  moment(dateClosing).toISOString();
            values.margeEstimee=parseInt( (values.caEstime * (values.pctgMargeEstimee / 100)), 10 )
           if(item.owner && item.owner.id)
                values.owner = { id: item.owner.id}
                
             handleSubmit(values)
              // actions.resetForm()
            }} >
        {({ handleChange, handleBlur,handleSubmit, values }) => (  
            
          <View>
            
            <View >
              
            <Text style={{color:'#0384C2',padding:10}}>Compte :</Text>
           <Picker style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width: '90 %',
                 borderColor: '#ccc',
                 borderRadius: 15, }} 
                 selectedValue={values.compte ? values.compte.code : ''}
                 
                 
                   onValueChange={handleChange('compte.code')}>
                    <Picker.Item label={item.compte.raisonSociale} value={item.compte.raisonSociale} />
           {comptes.map(compte => (
            <Picker.Item  key={compte.id} label={compte.title} value = {compte.id} />
           ))}
          </Picker>
          <Text style={{color:'#0384C2',padding:10}}>Types :</Text>
           <Picker style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 width:'90%',
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} selectedValue={values.type.code} onValueChange={handleChange('type.code')}>
                  {/* <Picker.Item label={item.type.code} value={item.type.code} /> */}
           {types.map(type => (
            <Picker.Item  key={type.code} label={type.code} value = {type.code} />
           ))}
          </Picker>
              </View>
              <View >
                
              <Text style={{color:'#0384C2',padding:10}}>Nature :</Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
           <Picker style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width : '50%',
                 borderColor: '#ccc',
                 borderRadius: 15, }} selectedValue={values.nature.code} onValueChange={handleChange('nature.code')}>
                  {/* <Picker.Item label={item.nature.code} value={item.nature.code} /> */}
           {natures.map(nature => (
            <Picker.Item key={nature.code} label={nature.libelle} value = {nature.code} />
           ))}
          </Picker>
          {opportuniteid && opportuniteid.age != null && (
             <View>
              <View style={{flexDirection:'row'}}>
             <Text style={{color:'#0384C2',padding:10}}>Age : </Text>
             <View style={{backgroundColor:'green',borderRadius:20,width:40,height:40,alignItems:'center'}}>
          <Text style={{padding:10 ,color:'white'}}>{opportuniteid.age}</Text>
          </View>
          </View>
          </View>
          )}
          </View>   
         
            <Text style={{color:'#0384C2',padding:10}}>Niv eng :</Text>
           <Picker style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width:'90%',
                 borderColor: '#ccc',
                 borderRadius: 15, }} selectedValue={values.niveauEngagement.code} onValueChange={handleChange('niveauEngagement.code')}>
                  {/* <Picker.Item label={item.niveauEngagement.code}value={item.niveauEngagement.code} /> */}
           {niveau.map(niveau => (
            <Picker.Item  key={niveau.code} label={niveau.code} value = {niveau.code} />
           ))}
          </Picker> 
            
            </View>
            <View style={{flexDirection:'row'}}>
            <View>
  <Text style={{ color: '#0384C2', padding: 10 }}>Date Remise :</Text>
  <View style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width:'40%',
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
  <TouchableOpacity onPress={() => showDatepicker('remise')}>
    <Text style={{textAlign:'center'}}>{moment(dateRemise).format('DD-MM-YYYY')}</Text>
  </TouchableOpacity>
  </View>
  {showRemise && (
    <DateTimePicker
    value={dateRemise}
      mode={modeRemise}
      is24Hour={true}
      display="default"
      onChange={onChangeRemise}
    />
  )}
</View>

<View style={{right:165}}>
  <Text style={{ color: '#0384C2', padding: 10 }}>Date Closing :</Text>
  <View style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width:'40%',
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
  <TouchableOpacity onPress={() => showDatepicker('closing')}>
    <Text style={{textAlign:'center'}}>{moment(dateClosing).format('MM-YYYY')}</Text>
  </TouchableOpacity>
  </View>
  {showClosing && (
    <DateTimePicker
    value={dateClosing}
      mode={modeClosing}
      is24Hour={true}
      display="default"
      onChange={onChangeClosing}
    />
  )}
</View>
    
   </View>
   {/* <View>
      <Text>RDV établi : </Text>
      <Text>{values.rdvEtabli}</Text>
   </View> */}

          <Text style={{ color: '#0384C2' , padding:10, }}>BU :</Text>
          <View style = {{
            backgroundColor:"lightgray",
              margin: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 15,
          }}>
          <MultiSelect 
          style={{flex: 1,  color:'black'}}
              items={buList.map((bu) => ({
                id: bu.id,
                name: bu.libelle,
              
              }))}
              uniqueKey="id"
              onClearSelector={(value)=>{
     
              }}
              onSelectedItemsChange={(selectedItems) => {
                console.log('Selected Items:', selectedItems);
                setBusDetail(selectedItems);
                setSelectedBuItems(selectedItems);
                const bus=[];
          
                selectedItems.forEach(element => {
                  
                   const obj={
                    id:element
                   }
                    bus.push(obj)
                    if (!isEqualArrays(selectedItems, busDetail)) {
                      setBusDetail(selectedItems);
                      setSelectedBuItems(selectedItems);
                      setKey(prevKey => prevKey + 1);
                      
                    }
                    // else{
                    //   const index = busDetail.indexOf(element);
                    //   busDetail.splice(index,1)
                    // }
               
               
                });
                  setBusSelected(bus);
             
              }}
              
              
              // selectedItems={item.busConcernes}
              
              selectedItems={busDetail}
              selectedText="bu"
              searchInputPlaceholderText=""
              tagRemoveIconColor="#6F6F6F"
              tagBorderColor="#6F6F6F"
              tagTextColor="#6F6F6F"
              selectedItemTextColor="black"
              selectedItemIconColor="black"
              itemTextColor="black"
              displayKey="name"
              searchInputStyle={{ color: 'lightgray' }}
              submitButtonColor="#6F6F6F"
             // styleMainWrapper={{color: 'lightgray',backgroundColor:'lightgray'}}
              styleDropdownMenuSubsection={{backgroundColor:'lightgray',color:'black'}}
              submitButtonText="Submit"
            />
          </View>

            <Text style={{color:'#0384C2',padding:10}}>Sujet:</Text>
            
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 textAlignVertical: 'top',
                 borderRadius: 15, }}
              onChangeText={handleChange('sujet')}
              onBlur={handleBlur('sujet')}
              value={values.sujet}
              multiline numberOfLines={10}
            />
            <Text style={{color:'#0384C2',padding:10}}>Description:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline numberOfLines={10}
            />
            
            <View style={{flex:1}}>
            <Text style={{color:'#0384C2',padding:10}}>caEstime:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 width : '30%',
                 textAlign:'center',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
                 keyboardType="numeric"
             onChangeText={handleChange('caEstime')}
              onBlur={handleBlur('caEstime')}
              value={values.caEstime}
            />    
            <Text style={{color:'#0384C2',padding:10}}>Marge:</Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlign:'center',
                 width : '30%',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
                 keyboardType="numeric"
             onChangeText={handleChange('pctgMargeEstimee')}
              onBlur={handleBlur('pctgMargeEstimee')}
              value={values.pctgMargeEstimee}
            />  
            <Text>%</Text>
            </View>
            
                
             </View>
             <Text style={{color:'#0384C2',padding:10}}>Marge estimé :</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlign:'center',
                 width : '30%',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
                 keyboardType="numeric"
              onChangeText={handleChange('margeEstimee')}
              onBlur={handleBlur('margeEstimee')}
              value={(values.caEstime * (values.pctgMargeEstimee / 100)).toFixed(2)}
            />  
             <Text style={{color:'#0384C2',padding:10}}>Plan d’Action:</Text>
             
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
              onChangeText={handleChange('weekPlaning')}
              onBlur={handleBlur('weekPlaning')}
              value={values.weekPlaning}
              multiline numberOfLines={6}
            />
            {opportuniteid && opportuniteid.weekPlaningUpdateInfos != null && (
            <View style={{padding: 10,backgroundColor:'lightgray',borderWidth:1,width:'40%',left:15,paddingTop:10,alignItems:'center'}}>
            <Text>{opportuniteid.weekPlaningUpdateInfos}</Text>
            </View>
            )}
           
            <Text style={{color:'#0384C2',padding:10}}>Risques:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
              onChangeText={handleChange('risques')}
              onBlur={handleBlur('risques')}
              value={values.risques}
              multiline numberOfLines={6}
            />
             <Text style={{color:'#0384C2',padding:10}}>Points Forts:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
              onChangeText={handleChange('pointsForts')}
              onBlur={handleBlur('pointsForts')}
              value={values.pointsForts}
              multiline numberOfLines={6}
            />
            <View style={{margin:20,marginHorizontal:200}}>
           
            <Button
  color="#5e89af"
  title="Modifier"
  onPress={() => {
    if (!switchValueee) {
      handleSubmit(values);
    }
  }}
  style={{ display: switchValueee ? 'none' : 'flex' }}
  disabled={switchValueee}
/>


      
      </View>
      
          </View>
             
        )}
      </Formik>
      </ScrollView>
        :   
        
        ''
      }
    {/* <ScrollView style={{height:'10%'}}> */}
  
        {/* Toggle button for CommentSystem */}
        
        {/* Toggle button for CommentSystem */}
        <View style={{backgroundColor:'#BFD0D8'}}>
        <TouchableOpacity onPress={toggleCommentSystem}>
          <View style={{ backgroundColor: 'white', padding: 10, alignItems: 'center',width:'25%',flexDirection:'row', borderRadius: 8, margin: 5 }}>
          <AntDesign style={{marginLeft:10}} name="arrowsalt" size={15} color="black" />
            <Text style={{ color: 'black' }}>
              {commentSystemVisible ? 'Hide Comment System' : 'Commentaires'}
            </Text>
          </View>
        </TouchableOpacity>
        </View>
        

        {/* Full-screen CommentSystem */}
        <Modal
          visible={commentSystemVisible}
          white
          animationType="slide"
          onRequestClose={closeCommentSystem}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CommentSystem oppId={oppId} />
            <TouchableOpacity onPress={closeCommentSystem}>
              <View style={{ backgroundColor: '#5e89af', padding: 10, alignItems: 'center',marginRight:470,flexDirection:'row',alignItems:'center', borderRadius: 8, margin: 5 }}>
              <AntDesign  name="arrowsalt" size={15} color="black" />
                <Text style={{ color: 'black' }}>Commentaires</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      
        
    </View>  
     
       
  );
};

export default DetailsOpp;   