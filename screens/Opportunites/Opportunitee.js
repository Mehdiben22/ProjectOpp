
import React ,{useEffect, useState }from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView,TouchableOpacity,ToastAndroid } from 'react-native';
import {Formik} from 'formik';
import Request from '../../common/Request';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fr';
import MultiSelect from 'react-native-multiple-select';




const Opportunitee = () => {

const [comptes , setComptes] = useState([]);
const [natures , setNatures] = useState([]);
const [types , setTypes] = useState([]);
const [niveau , setNiveau] = useState([]);
const [buList,setBulist]=useState([])
const [busSelected,setBusSelected]=useState([{}])
const [dateRemise, setDateRemise] = useState(new Date()); // Separate state for Date Remise
const [dateClosing, setDateClosing] = useState(new Date()); // Separate state for Date Closing
const [showRemise, setShowRemise] = useState(false);
const [modeRemise, setModeRemise] = useState('date');
const [showClosing, setShowClosing] = useState(false);
const [modeClosing, setModeClosing] = useState('date');
const [selectedBuItems, setSelectedBuItems] = useState([]);
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
  let selectedDate, selectedMode, setShow;

  if (type === 'remise') {
    selectedDate = dateRemise;
    selectedMode = modeRemise;
    setShow = setShowRemise;
  } else if (type === 'closing') {
    selectedDate = dateClosing;
    selectedMode = modeClosing;
    setShow = setShowClosing;
  }

  setShow(true);
  if (selectedMode === 'date') {
    setModeRemise('date');
    setModeClosing('date');
  } else {
    setModeRemise('time');
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
         .then(res =>res.json())
        .then(res=> {
            console.log('API reponse compte :',res);
            const data=res.map(e=> { return { title:e.raisonSociale,id:e.code}})
            setComptes(data);

        } )
        .catch(error => console.error('error compte list :', error));

        Request('/nature-opportunite/list/select','get')
        .then(res =>res.json())
        .then(res=> {
          console.log('API reponse :',res);
          
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
    },[])

    const handleSubmit =  (values) => {
      try {
       
        values["busConcernes"]=busSelected
        console.log("Submitting values:", values);
          // // Format dateClosing to ISO string
          // values.dateClosing = new Date(values.dateClosing).toISOString().toString();
          // values.dateRemise = new Date(values.dateRemise).toISOString().toString();
          // // Format dateRemise as needed
          //    const dateRemise = new Date(values.dateRemise);
          //    const formattedDateRemise = `${dateRemise.getFullYear()}-${(dateRemise.getMonth() + 1).toString().padStart(2, '0')}-${dateRemise.getDate().toString().padStart(2, '0')}`;
          //    values.dateRemise = formattedDateRemise;

      Request('/opportunite/create', 'POST', values)
      .then(response =>{
        console.log('Opp response');
        if (response.status === 200 ) {
          console.log('Opportunity created successfully!');
          showModificationSuccessMessage();
          navigation.navigate('Res', values);
        } else {
          console.error('Unexpected status code:', response.status);
        //  console.error('Response body:', response.data);
        }
      })
      .then(res => res.json())
        
      } catch (error) {
        console.error('Error creating opportunity:', error);
    
      }
    };
    
    const showModificationSuccessMessage = () => {
      console.log('ToastAndroid:', ToastAndroid);
    
      if (ToastAndroid) {
        ToastAndroid.showWithGravityAndOffset(
          'Enrengistrement effectuée avec succès',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        console.warn('ToastAndroid n\'est pas disponible.');
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
        compte: { code: '' },
       // busConcernes: busSelected ,
        sujet: '',
        description: '', 
        nature: {code:''},
        type: {code:''},
        niveauEngagement: {code:''},
        dateRemise: new Date(),
        dateClosing: new Date(),
       // rdvEtabli: '',
        caEstime : 0 ,
        margeEstimee : 0,
        pctgMargeEstimee : 0  , 
        weekPlaning: '',
        risques: '',
        pointsForts: '',
        }}
       onSubmit={ (values, actions) => {
        values.dateRemise = moment(dateRemise).toISOString();
        values.dateClosing = moment(dateClosing).toISOString();
        values.margeEstimee=parseInt( (values.caEstime * (values.pctgMargeEstimee / 100)), 10 )
        console.log("VALUES ",values)
       
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
                    <Picker.Item label="" value="" />
           {comptes.map(compte => (
            <Picker.Item  key={compte.id} label={compte.title} value = {compte.id} />
           ))}
          </Picker>
          
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
           style={{backgroundColor:"lightgray"}}
              items={buList.map((bu) => ({
                id: bu.id,
                name: bu.libelle,
              
              }))}
              uniqueKey="id"
              onSelectedItemsChange={(selectedItems) => {
                console.log("selectedItems",selectedItems)
                setSelectedBuItems(selectedItems);
                const bus=[];
                selectedItems.forEach(element => {
                  
                   const obj={
                    id:element
                   }
                   console.log("obj ",obj)
                    bus.push(obj)
                });
                setBusSelected(bus);
                console.log("IN",bus)
              }}
              
              selectedItems={selectedBuItems}
              selectedText="bu"
              searchInputPlaceholderText="Search Items..."
              onChangeInput={(text) => console.log(text)}
              tagRemoveIconColor="#6F6F6F"
              tagBorderColor="#6F6F6F"
              tagTextColor="#6F6F6F"
              selectedItemTextColor="#6F6F6F"
              selectedItemIconColor="#6F6F6F"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: '#6F6F6F' }}
              styleDropdownMenuSubsection={{backgroundColor:'lightgray'}}
              submitButtonColor="#6F6F6F"
              submitButtonText="Submit"
            />
</View>
          <Text style={{color:'#0384C2',padding:10}}>Sujet :</Text>
          
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.sujet} onChangeText={handleChange('sujet')} multiline numberOfLines={10} />
                
          <Text style={{color:'#0384C2',padding:10 }}>Description :</Text>
          <TextInput style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.description} onChangeText={handleChange('description')} multiline numberOfLines={10} />

          <Text style={{color:'#0384C2',padding:10}}>Nature :</Text>
           <Picker style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 15, }} selectedValue={values.nature.code} onValueChange={handleChange('nature.code')}>
                  <Picker.Item label="" value="" />
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
                  <Picker.Item label="" value="" />
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
                  <Picker.Item label="" value="" />
           {niveau.map(niveau => (
            <Picker.Item  key={niveau.code} label={niveau.code} value = {niveau.code} />
           ))}
          </Picker> 
          <View style={{flex:1}}>
           <Text style={{color:'#0384C2',padding:10}}>Date Remise :</Text>
          <View style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
           <TouchableOpacity onPress={() => showDatepicker('remise')}>
           <Text style={{textAlign:'center'}} >{moment(dateRemise).format('DD-MM-YYYY')}</Text>
                  
            {showRemise  && (
              <DateTimePicker
                testID="dateTimePicker"
                // placeholder="DD/MM/YYYY"value={dateRemise}
                value = {dateRemise}
                mode={modeRemise}
                is24Hour={true}
                display="default"
                onChange={onChangeRemise}
              />
            )}
      </TouchableOpacity>            
           </View>

           <Text style={{color:'#0384C2',padding:10}}>Date Closing :</Text>
          <View style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 5,
                 marginHorizontal:202,
                 right:190
                 ,}}>
          <TouchableOpacity onPress={() => showDatepicker('closing')}>
          <Text style={{textAlign:'center'}}> {moment(dateClosing).format('DD-MM-YYYY')}</Text>
            {showClosing  && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateClosing}
                mode={modeClosing}
                is24Hour={true}
                display='default'
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
                 textAlign:'center',
                 width : '30%',
                 borderRadius: 15, }}
           keyboardType="numeric"
           value={values.caEstime}
           onChangeText={handleChange('caEstime')}
         />
         <Text style={{color:'#0384C2',padding:10}}>Marge :</Text>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlign:'center',
                 width : '30%',
                 borderColor: '#ccc',
                 borderRadius: 15, }}
           keyboardType="numeric"
           value={values.pctgMargeEstimee}
           onChangeText={                    
                            handleChange('pctgMargeEstimee')
                           
                         }
         />
        <Text>%</Text>
       </View>  
       
         <Text style={{color:'#0384C2',padding:10}}>Marge estimé :</Text>
         <TextInput style={{ backgroundColor: 'lightgray', margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 borderColor: '#ccc',
                 textAlign:'center',
                 width : '30%',
                 borderRadius: 15, }}      
                 keyboardType="numeric"
                 value={(values.caEstime * (values.pctgMargeEstimee / 100)).toFixed(2)}
            //onChangeText={handleChange('margeEstimee')} 
            
            >
           
            </TextInput>

          <Text style={{color:'#0384C2',padding:10}}>Plan d’Action:</Text>
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.weekPlaning} onChangeText={handleChange('weekPlaning')} multiline numberOfLines={6} />

          <Text style={{color:'#0384C2',padding:10}}>Risques :</Text>
          <TextInput style={{backgroundColor: 'lightgray' ,margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.risques} onChangeText={handleChange('risques')} multiline numberOfLines={6} />

          <Text style={{color:'#0384C2',padding:10}}>Points Forts :</Text>
          <TextInput style={{backgroundColor: 'lightgray' , margin: 10,
                 padding: 10,
                 borderWidth: 1,
                 textAlignVertical: 'top',
                 borderColor: '#ccc',
                 borderRadius: 15,}} value={values.pointsForts} onChangeText={handleChange('pointsForts')} multiline numberOfLines={6} />
          <View style={{margin:20,marginHorizontal:200}}>
          <Button  color="#5e89af"  title="Enrengistrer" onPress={() => {
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