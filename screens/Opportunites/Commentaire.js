import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,ScrollView , ActivityIndicator ,ToastAndroid , KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
import Request from '../../common/Request';
// import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';


const CommentSystem = ({ oppId }) => {
  const [oppcomment, setOppcomment] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [valuerep, setValuerep] = useState(null);
  const [items, setItems]=useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [mainCommentOpen, setMainCommentOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState([]);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);


  const [fullCommentText, setFullCommentText] = useState('');
  const [commentResponsesCount, setCommentResponsesCount] = useState({});
  const [loading, setLoading] = useState(true); // New loading state
  
  
 

  // useEffect(() => {
  //   setFullCommentText(`${selectedResources.map(resource => `@${resource.label}`).join(' ')} ${commentText}`);
  // }, [selectedResources, commentText]);
  const Showcommentsucces = () => {
    console.log('ToastAndroid:', ToastAndroid);
  
    if (ToastAndroid) {
      ToastAndroid.showWithGravityAndOffset(
        'Commentaire supprimé !',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      console.warn('ToastAndroid n\'est pas disponible.');
    }
  };


  // const Showreponsesucces = () => {
  //   console.log('ToastAndroid:', ToastAndroid);
  
  //   if (ToastAndroid) {
  //     ToastAndroid.showWithGravityAndOffset(
  //       'Reponse supprimé ! ',
  //       ToastAndroid.LONG,
  //       ToastAndroid.BOTTOM,
  //       25,
  //       50
  //     );
  //   } else {
  //     console.warn('ToastAndroid n\'est pas disponible.');
  //   }
  // };
  
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

 
 const  getComment=()=>{
    console.log("oppID ", oppId)
    Request(`/comment/list/opportunite/${oppId}`, 'GET')
      .then(res => res.json())
      .then(res => {
        console.log('api comment:', res);
        setOppcomment(res);
      })
      .catch(error => {
        console.error('Error fetching opportunite comment list:', error);
      });
  }
  useEffect(() => {
  
      getComment()
      Request ('/ressource/list/select', 'GET')
      .then(res => res.json())
      .then(res => {
        console.log('ress list:', res);
        const data=res.map(e=> { return { label:e.nomComplet,value:e.id}})       
         setItems(data);
      })
      .catch(error => {
        console.error('Error fetching ress comment list:', error);
      });

      Request('/ressource/current-user', 'GET')
      .then(res => res.json())
        .then(res => {
          console.log('API response list:', res);
          setCurrentUser(res);
         
        })
        .catch(error => {
          console.error('Error fetching ressource user:', error);
          
        });
  
  
      

      
    //   Request('/comment/create/v2', 'POST', commentData )
    //   .then(response =>{
    //     console.log('comm response');
    //     if (response.status === 200 ) {
    //       console.log('Comment created successfully!');
    //       setOppcomment(prevComments => [response.data, ...prevComments]);
    //       setCommentText('');
    //     } else {
    //       console.error('Unexpected status code:', response.status);
    //     //  console.error('Response body:', response.data);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error creating comment:', error);
    //   }); 

const fetchData = async () => {
      try {
        // Set loading to true when starting the request
        setLoading(true);

        // Fetch comments
        const commentResponse = await Request(`/comment/list/opportunite/${oppId}`, 'GET');
        const res = await commentResponse.json();
        setOppcomment(res);

        // Fetch resources list
        const ressResponse = await Request('/ressource/list/select', 'GET');
        const ressData = await ressResponse.json();
        const data = ressData.map((e) => ({ label: e.nomComplet, value: e.id }));
        setItems(data);

        // Fetch current user
        const currentUserResponse = await Request('/ressource/current-user', 'GET');
        const currentUserData = await currentUserResponse.json();
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Set loading to false when the request is completed (whether successful or not)
        setLoading(false);
      }
    };

    fetchData();
  }, [oppId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5e89af" />
      </View>
    );
  }
  const handleValueChange =(itemValue)=>{
    
    setSelectedResources(itemValue)
  }

  const commentResponse =(comment)=>{
    console.log(comment.id)
   // tu passe id de commentaire parent ou principale 
    handleSendComment(comment.id) 
    setShowReplyInput(comment.id);
  }

  const handleSendComment = async (parrentId) => {
    console.log('Sending comment:', commentText);
    const objectreceivers = []
    // console.log("length ",selectedResources.length)
    if (selectedResources && selectedResources.length > 0) {
      selectedResources.map((id) => objectreceivers.push({ id: id }));
    }
    const commentData = {
        comment: {
            message: commentText,
          writter: {
            id: currentUser.id,
          },
          subject: `opportunite:${oppId}`,
          child: parrentId===undefined? false:true,
          receivers: objectreceivers
        },
        relatedItem: {
          opportunite: {
            id: oppId,
          },
        },
      };
      //pour la response a un commentarire deja existe 
      if(parrentId){
        commentData.comment['parent']={
            id:parrentId
        }
      }
       console.log("commentDat a ",commentData)

    // Add logic to send the comment to the server or perform any other action
    // You may want to update the state or make a request to update the comments list
    try {
        const response = await Request('/comment/create/v2', 'POST', commentData);
        console.log('Comment response:', response);
    
        if (response.status === 200) {
          console.log('Comment created successfully!');
          getComment()
         // Update the state to include the new comment
        //setOppcomment(prevComments => [response.data, ...prevComments]);
    
          // Clear the comment text
          setCommentText('');
          setSelectedResources([]);
        } else {
          console.error('Unexpected status code:', response.status);
        }
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    };

    const handleDeleteComment = async (commentId ) => {
      try {
        console.log('Deleting comment with ID:', commentId);
        const response = await Request(`/comment/delete/${commentId}`, 'POST');
        console.log('Delete comment response:', response);
    
        if (response.status === 200) {
          console.log('Comment deleted successfully!'); 
          Showcommentsucces();
    
          // Mettez à jour l'état pour exclure le commentaire supprimé
          setOppcomment(prevComments => {
            const updatedComments = prevComments.filter(comment => {
              // Exclude the deleted comment
              if (comment.id !== commentId) {
                // Exclude responses associated with the deleted comment
                comment.responses = comment.responses.filter(response => response.id !== commentId);
             
                return true;
                
              }
           
              return false;
              
            });
            return updatedComments;
          });
        } else {
          console.error('Unexpected status code:', response.status);
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    };
  
  

  const renderCommentsAndResponses = () => {
    const reversedComments = [...oppcomment].reverse(); 
    return reversedComments.map((res) => (
      <View key={res.id}>
       {res && res.isChild ? (
          // Display response
          <View style={{ marginLeft: 40 }}>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
              <FontAwesome name="user-circle" size={30} color="black" />
              <Text style={{ margin: 5, fontWeight: 'bold' }}>{` ${res.writter.login}`}</Text>
              <Text>{`${formatDateTime(res.createdDate)}`}</Text>
            </View> */}
            {/* {res.receivers && res.receivers.length > 0 && (
              <View style={{ flexDirection: 'row', margin: 10 }}>
                {res.receivers.map(receiver => (
                  <View key={receiver.id}>
                    <Text style={{ color: 'blue' }}>{` @${receiver.login}`}</Text>
                  </View>
                ))}
              </View>
            )} */}
            {/* <Text style={{ color: 'blue', left: 40 }}>{` @${res.writter.login} `}</Text>
            <Text style={{ left: 45 }}>{`${res.message}`}</Text>
            <View style={{ flexDirection: 'row', margin: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%', left: 40 }}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Répondre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%', left: 50 }}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Supprimer</Text>
              </TouchableOpacity>
            </View> */} 
            {res.responses && res.responses.length > 0 && (
              <View style={{ marginLeft: 40, marginTop: 10 }}>
                {res.responses.map((response) => (
                  <View key={response.id}>
                     <View style={{ flexDirection: 'row', margin: 10, alignContent: 'center', alignItems: 'center' }}>
              <FontAwesome name="user-circle" size={30} color="black" />
              <Text style={{ margin: 5, fontWeight: 'bold' }}>{` ${response.writter.ressource.nomComplet}`}</Text>
              <Text>{`${formatDateTime(response.createdDate)}`}</Text>
            </View>  
                   <View style={{flexDirection:'row' , alignItems:'center' , left : 45 }}>
                    <Text style={{ color: 'blue' }}>{` @${response.writter.ressource.nomComplet} `}</Text>
                    {response.receivers.map(receiver => (
                <View key={receiver.id}>
                  <Text style={{ color: 'blue' }}>{` @${receiver.ressource.nomComplet}`}</Text>
                </View>
              ))}
             

                    </View>
                    <Text style={{left:50}}>{`${response.message}`}</Text>
                    {/* Add other response information if needed */}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          // Display main comment
          <View>
            <View style={{ flexDirection: 'row', margin: 10, alignContent: 'center', alignItems: 'center' , marginLeft:20 }}>
                
              <FontAwesome name="user-circle" size={30} color="black" />
              <Text style={{ margin: 5, fontWeight: 'bold' }}>{` ${res.writter.ressource.nomComplet}`}</Text>
              <Text>{`${formatDateTime(res.createdDate)}`}</Text>
            </View>
            <View style={{ marginLeft: 40 }}>
              {res.receivers.map(receiver => (
                <View key={receiver.id}>
                  <Text style={{ color: 'blue' }}>{` @${receiver.ressource.nomComplet}`}</Text>
                </View>
              ))}
              <Text>{` ${res.message}`}</Text>
              <View style={{flexDirection:'row',}}>
              <TouchableOpacity
                style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%' }}
                onPress={()=>{//commentResponse(res)
                    setShowReplyInput(res.id); 
                    setReplyingToCommentId(res.id)
                    
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Répondre</Text>
              </TouchableOpacity>
              {!res.responses || res.responses.length === 0 ? (
             
                
              <TouchableOpacity
                    style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%', left: 12 }}
                    onPress={() => handleDeleteComment(res.id)}
               >
                
                     <Text style={{ color: 'white', textAlign: 'center' }}>Supprimer</Text>
                       
                     </TouchableOpacity>
                     
                
                          ) : null}  
              </View>
              {showReplyInput === res.id && (
                
            <View style={{alignItems:'center'}}>

               <DropDownPicker
                    open={responseOpen}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
              }}
                    items={items}
                    setOpen={setResponseOpen}
                    setValue={setValuerep}
                    value={valuerep}
                    setItems={setItems}
                    searchable={true}
                    defaultValue={null}
                    multiple={true}
                    mode="BADGE"
                    placeholder=""
                    style={{
                      borderWidth: 1,
                      borderRadius: 2,
                      padding: 5,
                      margin: 5,
                      width: '93%',
                      backgroundColor: 'white',
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    onChangeValue={handleValueChange}
                  />
                  <View style={{flexDirection:'row'}}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  marginTop: 10,
                  marginRight: 10,
                  width:'80%'
                }}
                placeholder="Ajouter une réponse"
                value={commentText}
                onChangeText={(text) => setCommentText(text)}
              />
             
              <TouchableOpacity
                style={{
                  padding: 5,
                  backgroundColor: '#5e89af',
                  borderRadius: 5,
                  width: '10%',
                  marginTop: 10,
                  alignItems:'center',
                  alignSelf:'center'
                }}
                onPress={() => {
                  handleSendComment(res.id);
                  setShowReplyInput(null);
                }}
              >
                <Ionicons name="ios-send-outline" size={24} color="black" />
              </TouchableOpacity>
              </View>
             
            </View>
          )}
            </View>
            {res.responses && res.responses.length > 0 && (
              <View style={{ marginLeft: 40, marginTop: 10 }}>
                {res.responses.map((response) => (
                  <View  key={response.id}>
                     <View style={{ flexDirection: 'row', margin: 10, alignContent: 'center', alignItems: 'center' }}>
              <FontAwesome name="user-circle" size={30} color="black" />
              <Text style={{ margin: 5, fontWeight: 'bold' }}>{` ${response.writter.ressource.nomComplet}`}</Text>
              <Text>{`${formatDateTime(response.createdDate)}`}</Text>
            </View>  
                   <View style={{flexDirection:'row' , alignItems:'center' , left : 45 }}>
                    <Text style={{ color: 'blue' }}>{` @${response.writter.ressource.nomComplet} `}</Text>
                    {response.receivers.map(receiver => (
                <View key={receiver.id}>
                  <Text style={{ color: 'blue' }}>{` @${receiver.ressource.nomComplet}`}</Text>
                </View>
              ))}
                    </View>
                    <Text style={{left:50}}>{`${response.message}`}</Text>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%', left: 40 }}
                // onPress={()=>commentResponse(response)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Répondre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#5e89af', borderRadius: 5, padding: 5, marginTop: 10, width: '15%', left: 50 }}
                onPress={() => handleDeleteComment(response.id)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Supprimer</Text>
              </TouchableOpacity>
            </View>
                    {/* Add other response information if needed */}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <View style={{ flex: 1, padding: 5 ,padding: Platform.OS === 'ios' ? 5 : 5   }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon style={{marginLeft:15}} name="comment" size={24} color="#5e89af" />
        <Text style={{ fontSize: 16, marginLeft: 15 }}>Commentaires</Text>
      </View>
      <View>
        <View style={{ margin: 10 }}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
          <FontAwesome style={{marginLeft:5}}  name="user-o" size={30} color="black" />
          <View style={{flexDirection:'row'}}>
          <DropDownPicker
            open={mainCommentOpen}
            // dropDownStyle={{backgroundColor: '#fafafa'}}
            listMode="SCROLLVIEW"
            items={items}
            setOpen={setMainCommentOpen}
            setValue={setValue}
            searchable={true}
            value={value}
            setItems={setItems}
            defaultValue={null}
            multiple={true}
            mode="BADGE"
            placeholder=""
             style={{ borderWidth: 1, borderRadius: 2, padding: 5, margin: 5 , width:'93%',backgroundColor:'white' }}
            // containerStyle={{ height: 40 }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            // onChangeItem={(item) =>  console.log(item)
               
            // }
            onChangeValue={handleValueChange}
          />
          </View>
          
          </View>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 15, marginRight: 10, margin: 5 ,width:'50%',marginLeft:20  }}
            placeholder= 'Ajouter un commentaire....'
            value={commentText}
            onChangeText={text => setCommentText(text)}
          />
        
        </View>
        <TouchableOpacity
          style={{ padding: 5, backgroundColor: '#5e89af', borderRadius: 5, width: '15%', left: 480, alignItems: 'center' , marginLeft:30 }}
          onPress={()=>handleSendComment(undefined)}
        >
          <Ionicons  name="ios-send-outline" size={24} color="black" />
        </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={{flex :1,borderWidth:1  }}>
      {renderCommentsAndResponses()}
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
};

export default CommentSystem;
