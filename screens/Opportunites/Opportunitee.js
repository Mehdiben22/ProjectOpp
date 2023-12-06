
import React ,{useEffect, useState }from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import {Formik} from 'formik';
import Request from '../../common/Request';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';



const Opportunitee = () => {

const [comptes , setComptes] = useState([]);
const [natures , setNatures] = useState([]);
const [types , setTypes] = useState([]);
const [niveau , setNiveau] = useState([]);
const [buList,setBulist]=useState([])
const [dateRemise, setDateRemise] = useState(new Date()); // Separate state for Date Remise
const [dateClosing, setDateClosing] = useState(new Date()); // Separate state for Date Closing
const [showRemise, setShowRemise] = useState(false);
const [modeRemise, setModeRemise] = useState('date');
const [showClosing, setShowClosing] = useState(false);
const [modeClosing, setModeClosing] = useState('date');
const navigation = useNavigation();



const onChangeRemise = (event, selectedDate) => {
  const currentDate = selectedDate || dateRemise;
  setShowRemise(false);
  setDateRemise(currentDate);
};

const onChangeClosing = (event, selectedDate) => {
  const currentDate = selectedDate || dateClosing;
  setShowClosing(false);
  setDateClosing(currentDate);
};

const showDatepicker = (type) => {
  if (type === 'remise') {
    setShowRemise(true);
    setModeRemise('date');
  } else if (type === 'remise-time') {
    setShowRemise(true);
    setModeRemise('time');
  } else if (type === 'closing') {
    setShowClosing(true);
    setModeClosing('date');
  } else if (type === 'closing-time') {
    setShowClosing(true);
    setModeClosing('time');
  }
};

// const showMode = (currentMode) => {
//   setShow(true);
//   setMode(currentMode);
// };

// const showDatepicker = () => {
//   showMode('date');
// };

// const showTimepicker = () => {
//   showMode('time');
// };


    useEffect(()=>{
         Request('/compte/list/select','GET')
        .then(res=> {
           // console.log('API reponse compte :',res.data);
            const data=res.data.map(e=> { return { title:e.raisonSociale,id:e.code}})
            setComptes(data);

        } )
        .catch(error => console.error('error compte list :', error));

        Request('/nature-opportunite/list/select','get')
        .then(res=> {
          //console.log('API reponse :',res);
          
            setNatures(res.data);
        } )
        .catch(error => console.error('error nature opportunite :', error));

        Request('/type-opportunite/list/select','get')
        .then(res=> {
//console.log('API reponse :',res);
            setTypes(res.data);
        } )
        .catch(error => console.error('error types list :', error));

        Request('/niveau-engagement/list/select','get')
        .then(res=> {
           // console.log('API reponse :',res);
            setNiveau(res.data);
        } )
        .catch(error => console.error('error Niveau engagement :', error));

    
        Request('/bu/list/select','get')
        .then(res=> {
          //console.log('API reponse :',res);
          
            setBulist(res.data);
        } )
        .catch(error => console.error('error nature opportunite :', error));
    },[])

    const handleSubmit = async (values) => {
      try {
        console.log("Submitting values:", values);

          // // Format dateClosing to ISO string
          // values.dateClosing = new Date(values.dateClosing).toISOString().toString();
          // values.dateRemise = new Date(values.dateRemise).toISOString().toString();
          // // Format dateRemise as needed
          //    const dateRemise = new Date(values.dateRemise);
          //    const formattedDateRemise = `${dateRemise.getFullYear()}-${(dateRemise.getMonth() + 1).toString().padStart(2, '0')}-${dateRemise.getDate().toString().padStart(2, '0')}`;
          //    values.dateRemise = formattedDateRemise;

        const response = await Request('/opportunite/create', 'POST', values);
    
        console.log('API response:', response);
    
        if (response.status === 200 ) {
          console.log('Opportunity created successfully!');
          navigation.navigate('Res', values);
        } else {
          console.error('Unexpected status code:', response.status);
          console.error('Response body:', response.data);
        }
      } catch (error) {
        console.error('Error creating opportunity:', error);
    
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    };
    
      
  return (
    <View style= {
      {flex: 1,
      marginTop:10,
      fontSize: 20,   }
    } >
      
    <Formik
      initialValues={{
        compte: {code:''},
        busConcernes: [] ,
        sujet: '',
        description: '', 
        nature: {code:''},
        type: {code:''},
        niveauEngagement: {code:''},
        dateRemise: new Date(),
        dateClosing: new Date(),
       // rdvEtabli: '',
        caEstime : 0 ,
        margeEstimee : 0 ,
        pctgMargeEstimee : 0  , 
        weekPlaning: '',
        risques: '',
        pointsForts: '',
        }}
       onSubmit={ (values, actions) => {
        values.dateRemise = moment(dateRemise).toISOString();
        values.dateClosing = moment(dateClosing).toISOString();
         handleSubmit(values)
         actions.resetForm()
        }}
      
       > 
      {({ handleChange, handleSubmit, values }) => (
        <ScrollView style={{backgroundColor:'#BFD0D8'}} >
           <Text style={{color:'#0384C2',padding:10}}>Compte :</Text>
           <Picker style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }} 
                 selectedValue={values.compte ? values.compte.code : ''}

                   onValueChange={handleChange('compte.code')}>
           {comptes.map(compte => (
            <Picker.Item  key={compte.id} label={compte.title} value = {compte.id} />
           ))}
          </Picker>
          <Text style={{ color: '#0384C2' , padding:10, }}>BU :</Text>
          <Picker
          selectedValue={( values.busConcernes && values.busConcernes[0])?values.busConcernes[0].id:""}

          
           //onValueChange={handleChange('busConcernessConcernes[0].id')}
           onValueChange={(value) => {
            // Create a copy of the busConcernessConcernes array
            //const updatedBuArray = [...values.busConcernes];
            // // Update the selected busConcernessConcernes item in the array
            // updatedBuArray[0] = { id: value };
            
            // // Update Formik state
            // values.busConcernes[0]=updatedBuArray[0];
            // console.log(values.busConcernes[0])
            values.busConcernes.push({id: value})

          }}

         style={{
          backgroundColor: 'lightgray',
          margin: 10,
          padding: 10,
          borderWidth: 1,
         borderColor: '#ccc',
         borderRadius: 15,
         }}
         >
        {buList.map(bu => (
            <Picker.Item  key={bu.id} label={bu.libelle} value = {bu.id} />
           ))}
         </Picker>

          <Text style={{color:'#0384C2',padding:10}}>Sujet :</Text>
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.sujet} onChangeText={handleChange('sujet')} multiline numberOfLines={6} />
          <Text style={{color:'#0384C2',padding:10 }}>Description :</Text>
          <TextInput style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.description} onChangeText={handleChange('description')} multiline numberOfLines={6} />

          <Text style={{color:'#0384C2',padding:10}}>Nature :</Text>
           <Picker style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }} selectedValue={values.nature.code} onValueChange={handleChange('nature.code')}>
           {natures.map(nature => (
            <Picker.Item key={nature.code} label={nature.libelle} value = {nature.code} />
           ))}
          </Picker>

          <Text style={{color:'#0384C2',padding:10}}>Types :</Text>
           <Picker style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} selectedValue={values.type.code} onValueChange={handleChange('type.code')}>
           {types.map(type => (
            <Picker.Item  key={type.code} label={type.code} value = {type.code} />
           ))}
          </Picker>

          <Text style={{color:'#0384C2',padding:10}}>Niv engagement :</Text>
           <Picker style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }} selectedValue={values.niveauEngagement.code} onValueChange={handleChange('niveauEngagement.code')}>
           {niveau.map(niveau => (
            <Picker.Item  key={niveau.code} label={niveau.code} value = {niveau.code} />
           ))}
          </Picker> 
          <View style={{flex:1}}>
           <Text style={{color:'#0384C2',padding:10}}>Date Remise :</Text>
          <View style={{backgroundColor: 'gray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
           <TouchableOpacity onPress={() => showDatepicker('remise')}>
                  <Text>selected: {moment(dateRemise).locale('fr').format('MMMM Do YYYY, h:mm:ss a')
                  }</Text>
                  
            {showRemise  && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateRemise}
                mode={modeRemise}
                is24Hour={true}
                onChange={onChangeRemise}
              />
            )}
      </TouchableOpacity>            
           </View>

           <Text style={{color:'#0384C2',padding:10}}>Date Closing :</Text>
          <View style={{backgroundColor: 'gray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
          <TouchableOpacity onPress={() => showDatepicker('closing')}>
                  <Text>selected: {moment(dateClosing).locale('fr').format('MMMM Do YYYY, h:mm:ss a')}</Text>
            {showClosing  && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateClosing}
                mode={modeClosing}
                is24Hour={true}
                onChange={onChangeClosing}
              />
              
            )}
      </TouchableOpacity>            
           </View>
           </View>
           <Text style={{color:'#0384C2',padding:10}}>CA estimé :</Text>
           <TextInput  style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }}
           keyboardType="numeric"
           value={values.caEstime}
           onChangeText={handleChange('caEstime')}
         />
         <Text style={{color:'#0384C2',padding:10}}>Marge :</Text>
         <View  style={{ backgroundColor: 'lightgray',margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15}}>
         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
           <TextInput style={{ backgroundColor: 'lightgray',  }}
           keyboardType="numeric"
           value={values.pctgMargeEstimee}
           onChangeText={                    
                            handleChange('pctgMargeEstimee')
                           
                         }
         />
        <Text>%</Text>
       </View>  
       </View>
         <Text style={{color:'#0384C2',padding:10}}>Marge estimé :</Text>
         <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }}      
                 keyboardType="numeric"
                 
            onChangeText={handleChange('margeEstimee')}   >
            {(values.caEstime*(values.pctgMargeEstimee/100)).toFixed(2)}
            </TextInput>

          <Text style={{color:'#0384C2',padding:10}}>Plan d’Action :</Text>
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.weekPlaning} onChangeText={handleChange('weekPlaning')} multiline numberOfLines={4} />

          <Text style={{color:'#0384C2',padding:10}}>Risques :</Text>
          <TextInput style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.risques} onChangeText={handleChange('risques')} multiline numberOfLines={3} />

          <Text style={{color:'#0384C2',padding:10}}>Points Forts :</Text>
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.pointsForts} onChangeText={handleChange('pointsForts')} multiline numberOfLines={3} />
          <View style={{margin:20,marginHorizontal:200}}>
          <Button   title="Enrengistrer" onPress={() => {
          handleSubmit(values);
      } } />
      </View>
        </ScrollView>
      )}
    </Formik>
    </View>
  );
};

export default Opportunitee;


const styles = StyleSheet.create({})