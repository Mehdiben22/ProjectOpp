import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Formik } from 'formik';
import CommentSystem from './Commentaire';
import Request from '../../common/Request';
import { Picker } from 'react-native-dropdown-picker';


const DetailsOpp = ({ oppId }) => {
  const [item,setItem]=useState()


  useEffect(() => {
    console.log('ID porps ==>',oppId)
    Request('/opportunite/get/'+oppId,'get')
        .then(res=> {
          setItem(res.data);
        } )
        .catch(error => console.error('error nature opportunite :', error));

   
  }, []);

  

  return (
    <View style={{flex:1,height:'100%'}}>
      {
        item ? 
        <ScrollView style={{height:'20%',backgroundColor:'#BFD0D8'}}>
        <Formik >
        {({ handleChange, handleBlur, values }) => (
          <View>
            <View style={{flexDirection:'row'}}>
            <Text style={{color:'#0384C2',padding:10}}>Compte:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,
                 width:'30%'
                }}
              onChangeText={handleChange('compte')}
              onBlur={handleBlur('compte')}
              value={item.compte.raisonSociale}
            />

            <Text style={{color:'#0384C2',padding:10}}>Type:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,
                 width:'30%' }}
              onChangeText={handleChange('type')}
              onBlur={handleBlur('type')}
              value={item.type.code}
            />
              </View>
              <View style={{flexDirection:'row'}}>
            <Text style={{color:'#0384C2',padding:11}}>Nature:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 18,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, 
                 width:'30%'}}
              onChangeText={handleChange('nature')}
              onBlur={handleBlur('nature')}
              value={item.nature.code}
            />
            <Text style={{color:'#0384C2',padding:1}}>Niv eng:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 15,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,
                 width:'30%' }}
              onChangeText={handleChange('niveauEngagement')}
              onBlur={handleBlur('niveauEngagement')}
              value={item.niveauEngagement.code}
            />
            </View>
            <Text style={{color:'#0384C2',padding:10}}>Sujet:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }}
              onChangeText={handleChange('sujet')}
              onBlur={handleBlur('sujet')}
              value={item.sujet}
            />

            <Text style={{color:'#0384C2',padding:10}}>caEstime:</Text>
            <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }}
                 keyboardType="numeric"
           //  onChangeText={handleChange('caEstime')}
              //onBlur={handleBlur('caEstime')}
              value={(item.caEstime).toString()}
            />      
          </View>
        )}
      </Formik>
      </ScrollView>
        :   
        
        ''
      }
    <ScrollView style={{height:'10%'}}>
      <View style={{}}>
    <CommentSystem/> 
    </View>
    </ScrollView>

    </View>   
  );
};

export default DetailsOpp;