import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image, KeyboardAvoidingView,Alert,ToastAndroid,Modal,ScrollView} from 'react-native';

import MyHeader from '../components/MyHeader'

import db from '../config'
import firebase from 'firebase'

export default class SettingScreen extends React.Component{
    
    constructor(){
        super()
        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            contact: '',
            emailID:'',
            docID:'',
        }
    }

    getUserDetails(){
        var user = firebase.auth().currentUser
        var email = user.email 
        db.collection('UsersCollection').where('emailID','==',email).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                var data = doc.data()
                this.setState({
                    firstName:data.firstName,
                    lastName:data.lastName,
                    contact:data.contact,
                    address:data.address,
                    emailID:data.emailID,
                    docID:doc.id,
                })
            })
        })
    }

    componentDidMount(){
        this.getUserDetails()
    }
    
    updateUserDetails = ()=>{
        db.collection('UsersCollection').doc(this.state.docID).update({
            'firstName': this.state.firstName,
            'lastName': this.state.lastName,
            'address': this.state.address,
            'contact': this.state.contact,    
        })
        Alert.alert("Profile Updated");
    }

    render(){
        return(
            <View
            style = {styles.container}>
                <MyHeader
                title = "Settings"/>
                <View
                style = {styles.formContainer}>
                <KeyboardAvoidingView>
                <TextInput 
                    style = {styles.formsTextInput}
                    placeholder = {"First Name"}
                    maxLength = {10}
                    onChangeText = {(text)=>{
                        this.setState({
                            firstName:text,
                            
                        })
                    }}
                    value = {this.state.firstName}
                />
                <TextInput
                    style = {styles.formsTextInput}
                    placeholder = {"Last Name"}
                    maxLength = {10}
                    onChangeText = {(text)=>{
                        this.setState({
                            lastName:text,
                            
                        })
                    }}
                    value = {this.state.lastName}
                />
                <TextInput 
                    style = {styles.formsTextInput}
                    placeholder = {"Address"}
                    multiline = {true}
                    onChangeText = {(text)=>{
                        this.setState({
                            address:text,
                            
                        })
                    }}
                    value = {this.state.address}
                />
                <TextInput 
                    style = {styles.formsTextInput}
                    placeholder = {"Contact"}
                    maxLength = {10}
                    keyboardType = {'numeric'}
                    onChangeText = {(text)=>{
                        this.setState({
                            contact:text,
                            
                        })
                    }}
                    value = {this.state.contact}
                />
                <TouchableOpacity
                style = {styles.button}
                onPress = {()=>{
                    this.updateUserDetails()
                }}>
                    <Text
                    style = {styles.buttonText}>
                        Update
                    </Text>
                </TouchableOpacity>
                </KeyboardAvoidingView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:20,
        backgroundColor:"#00f8fc",
    },
    formContainer:{
        flex:1,
        width:'100%',
        alignItems:'center',
    },
     formsTextInput:{
      height:40,
      width:'auto',
      borderWidth:1,
      alignItems:'center',
      justifyContent:'center',
      padding:10,
      marginTop:20,
      borderColor:"green",
      borderRadius:25,
    },
     button:{
      height:40,
      width:200,
      borderRadius:10,
      borderWidth:1,
      marginTop:10,
      alignItems:'center',
      justifyContent:"center",
      backgroundColor:"#2a229c",
    },
     buttonText:{
       fontSize:30,
       textAlign:'center',
       color:"red",
    }, 
 })
