import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList , ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';

const CommentSystem = () => {
const [commentText, setCommentText] = useState('');
const [comments, setComments] = useState([]);
const [replyText, setReplyText] = useState('');
const [replyingTo, setReplyingTo] = useState(null);
const [userId, setUserId] = useState('Utilisateur123');
const [mentionSuggestions, setMentionSuggestions] = useState([]);
const [userList] = useState([
'Utilisateur1',
'Utilisateur2',
'Utilisateur3',
'Utilisateur4',
// Ajoutez plus de noms d'utilisateurs au besoin
]);
const formatMentions = (text) => {
const words = text.split(' ');
return words.map((word, index) => {
if (word.startsWith('@')) {
return (
<Text key={index} style={{ color: 'blue' }}>
{word + ' '}
</Text>
);
} else {
return word + ' ';
}
});
};
const handleMentionQuery = (text) => {
const mentionIndex = text.lastIndexOf('@');
if (mentionIndex >= 0) {
const query = text.substring(mentionIndex + 1);
return query;
}
return '';
};
const mentionUsers = (query) => {
return userList.filter((user) => user.toLowerCase().includes(query.toLowerCase()));
};

const handleMentionSuggestions = (text) => {
const query = handleMentionQuery(text);
if (query) {
setMentionSuggestions(mentionUsers(query));
} else {
setMentionSuggestions([]); // Efface les suggestions si la requête est vide
}
};

const selectMention = (mention) => {
const lastMentionIndex = commentText.lastIndexOf('@');
const textBeforeMention = commentText.slice(0, lastMentionIndex);
const textAfterMention = commentText.slice(lastMentionIndex + 1 + mention.length);
setCommentText(textBeforeMention + `@${mention} ` + textAfterMention);
setMentionSuggestions([]);
};

const selectReplyMention = (mention) => {
const lastMentionIndex = replyText.lastIndexOf('@');
const textBeforeMention = replyText.slice(0, lastMentionIndex);
const textAfterMention = replyText.slice(lastMentionIndex + 1 + mention.length);
setReplyText(textBeforeMention + `@${mention} ` + textAfterMention);
setMentionSuggestions([]);
};
const addComment = () => {
if (commentText) {
const newComment = {
text: commentText,
userId: userId,
date: new Date().toLocaleString(),
replies: [],
};
setComments([...comments, newComment]);
setCommentText('');
}
};
const addReply = (comment) => {
if (replyText) {
const newReply = {
text: replyText,
userId: userId,
date: new Date().toLocaleString(),
};
comment.replies.push(newReply);
setComments([...comments]);
setReplyText('');
}
};
const toggleReplies = (comment) => {
comment.showReplies = !comment.showReplies;
setComments([...comments]);
};
const replyChanged = (text) => {
setReplyText(text);
handleMentionSuggestions(text);
};

const replyToComment = (comment) => {
// Lorsque vous répondez à un commentaire, ajoutez automatiquement la mention de l'utilisateur
const mention = `@${comment.userId} `;
setReplyingTo(comment);
setReplyText(mention); // Définissez le texte de réponse avec la mention de l'utilisateur du commentaire
};
//Avec ces modifications, lorsque vous cliquez sur "Répondre" à un commentaire, la mention de l'utilisateur du commentaire d'origine sera automatiquement ajoutée dans le champ de réponse. Cela permettra de diriger la réponse vers cet utilisateur par défaut.
return (
<View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
<View style={{ flexDirection: 'row' }}>
<Icon name="comment" size={24} color="#5e89af" />
<View style={{ alignContent: 'center', margin: 2 }}>
<Text style={{ fontSize: 16, marginBottom: 10 }}>Commentaires</Text>
</View>
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
<TextInput
placeholder="Ajouter un commentaire..."
value={commentText}
onChangeText={(text) => {
setCommentText(text);
handleMentionSuggestions(text);
}}
/>
<TouchableOpacity onPress={addComment}>
<Icon name="arrow-right" size={30} color="#5e89af" />
</TouchableOpacity>
</View>
{mentionSuggestions.length > 0 && (
<FlatList
data={mentionSuggestions}
renderItem={({ item }) => (
<TouchableOpacity onPress={() => selectMention(item)}>
<Text style={{ color: 'blue' }}>{item}</Text>
</TouchableOpacity>
)}
/>
)}
{comments.map((comment, index) => (
<View key={index} style={{ marginLeft: 20, marginTop: 10 }}>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
<View style={{ justifyContent: 'space-between', right: 25, alignItems: 'center' }}>
<FontAwesome name="user-circle" size={28} color="black" />
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
<Text style={{ color: 'red' }}>ID : {comment.userId}</Text>
<Text style={{ color: 'red' }}>Date : {comment.date}</Text>
</View>
</View>
<Text>{formatMentions(comment.text)}</Text>
<TouchableOpacity onPress={() => replyToComment(comment)}>
<Icon name="reply-all" size={20} color="#5e89af" />
</TouchableOpacity>
<TouchableOpacity onPress={() => toggleReplies(comment)}>
<Icon
name={comment.showReplies ? 'angle-up' : 'angle-down'}
size={20}
color="#5e89af"
/>
</TouchableOpacity>
{comment.showReplies && (
<View style={{ marginLeft: 20, marginTop: 10 }}>
{comment.replies.map((reply, replyIndex) => (
<View key={replyIndex}>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
<View style={{ justifyContent: 'space-between', right: 25, alignItems: 'center' }}>
<FontAwesome name="user-circle" size={28} color="black" />
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
<Text style={{ color: 'red' }}>ID : {reply.userId}</Text>
<Text style={{ color: 'red' }}>Date : {reply.date}</Text>
</View>
</View>
<Text>{formatMentions(reply.text)}</Text>
</View>
))}
<TextInput
placeholder="Répondre au commentaire..."
value={replyText}
onChangeText={(text) => replyChanged(text)}
/>
{mentionSuggestions.length > 0 && (
<FlatList
data={mentionSuggestions}
renderItem={({ item }) => (
<TouchableOpacity onPress={() => selectReplyMention(item)}>
<Text style={{ color: 'blue' }}>{item}</Text>
</TouchableOpacity>
)}
/>
)}
<TouchableOpacity onPress={() => addReply(comment)}>
<Icon name="arrow-right" size={20} color="#5e89af" />
</TouchableOpacity>
</View>
)}
</View>
))}
</View>
);
};

export default CommentSystem;