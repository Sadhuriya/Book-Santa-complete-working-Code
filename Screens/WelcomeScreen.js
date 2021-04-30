import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image, KeyboardAvoidingView,Alert,ToastAndroid,Modal,ScrollView} from 'react-native';

import db from '../config'
import firebase from 'firebase'
export default class WelcomeScreen extends React.Component{
  constructor(){
      super()
      this.state = {
          emailID: '',
          password: '',
          isModalVisible: false,
          firstName: '',
          lastName: '',
          contact: '',
          address: '',
          confirmPassword: '',
          isBookRequestActive: false,
       }
  }
 
  ShowModal = ()=>{
      return(
          <Modal
          animationType = "fade"
          transparent = {true}
          visible = {this.state.isModalVisible}>
              <View
              style = {styles.modalContainer}>
                  <ScrollView
                  style = {{
                      width:'100%',
                  }}>
                      <KeyboardAvoidingView
                      style = {styles.keyboardAvoidingView}>
                          <Text
                          style = {styles.modalTitle}>
                              Registration
                          </Text>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"First Name"}
                          maxLength = {10}
                          onChangeText = {(text)=>{
                              this.setState({
                                  firstName:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"Last Name"}
                          maxLength = {10}
                          onChangeText = {(text)=>{
                              this.setState({
                                  lastName:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"Contact"}
                          maxLength = {10}
                          keyboardType = {'numeric'}
                          onChangeText = {(text)=>{
                              this.setState({
                                  contact:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"Address"}
                          multiline = {true}
                          onChangeText = {(text)=>{
                              this.setState({
                                  address:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"EmailID"}
                          keyboardType = {'email-address'}
                          onChangeText = {(text)=>{
                              this.setState({
                                  emailID:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"Password"}
                          secureTextEntry = {true}
                          onChangeText = {(text)=>{
                              this.setState({
                                  password:text,
                              })
                          }}/>
                          <TextInput 
                          style = {styles.formsTextInput}
                          placeholder = {"Confirm Password"}
                          secureTextEntry = {true}
                          onChangeText = {(text)=>{
                              this.setState({
                                  confirmPassword:text,
                                  
                              })
                          }}/>
                          <View
                          style = {styles.modalView}>
                              <TouchableOpacity
                              style = {styles.modalButtons}
                              onPress = {()=>{
                                  this.SignUp(this.state.emailID,this.state.password,this.state.confirmPassword)
                                  }}>
                                  <Text>
                                      Register
                                  </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                              style = {styles.modalButtons}
                              onPress = {()=>{
                                  this.setState({
                                      isModalVisible:false,
                                  })
                              }}>
                                  <Text>
                                      Back
                                  </Text>
                              </TouchableOpacity>
                          </View>
                      </KeyboardAvoidingView>
                  </ScrollView>
              </View>
          </Modal>
      )
  }
  SignUp = async(email,password,confirmPassword)=>{
      if(password!==confirmPassword){
          return Alert.alert("Passward Does Not Match")
      }else{
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then((response)=>{
        return Alert.alert("Users Added SuccessFully")

    })
    .catch(function(error){
    var errorCode = error.code
    var errorMessage = error.message
    return Alert.alert(errorMessage)
    })
 db.collection('UsersCollection').add({
     firstName:this.state.firstName,
     lastName:this.state.lastName,
     contact:this.state.contact,
     emailID:this.state.emailID,
     address:this.state.address,
     isBookRequestActive:false,
 })
 }
 }
 login = async(email,password)=>{
     if(email&&password){
         try {
            const response = await firebase.auth().signInWithEmailAndPassword(email,password) 
            if(response){
                this.props.navigation.navigate('DonateBooks')


            }
         } catch (error) {
            switch(error.code){
                case 'auth/user-not-found': Alert.alert('User Doesnt Exists')
                break
                case 'auth/invalid-email': Alert.alert('Incorrect Email Or Password')
            }
         }
     }else{
         Alert.alert('Enter EmailId Or Password')
     }
  }
   
    render(){
       return(
           
        <View 
        style = {styles.container}>
               <KeyboardAvoidingView
                style = {{
                    alignItems:'center',
                    marginTop:20,
                }}>
                    
                   <View>
                       {this.ShowModal()}
                   </View>
                   <View>
                       
                       <Text
                         style = {styles.TitleText}>
                          Santa's Book App
                       </Text>
                   </View>
                   <View>
                       <TextInput 
                         style = {styles.loginBox}
                         placeholder = "abc@example.com"
                         keyboardType = 'email-address'
                         onChangeText = {(text)=>{
                             this.setState({
                              emailID:text
                            })
                        }}/>
                       <TextInput 
                         style = {styles.loginBox}
                         placeholder = "Enter Your Password"
                         secureTextEntry = {true}
                         onChangeText = {(text)=>{
                             this.setState({
                              password:text
                            })
                        }}/> 
                   </View>
                   <View>
                       <TouchableOpacity
                        onPress = {()=>{
                            this.login(this.state.emailID,this.state.password)
                        }}
                        style = {styles.loginButton}>
                           <Text>
                               Login
                           </Text>
                       </TouchableOpacity>
                       
                       <TouchableOpacity
                        onPress = {()=>{
                            this.setState({
                                isModalVisible:true,
                            })
                        }}
                        style = {styles.loginButton}>
                           <Text>
                               Sign Up
                               
                           </Text>
                       </TouchableOpacity>
                   </View>
                   
               </KeyboardAvoidingView>
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
     loginBox:{
      height:40,
      width:200,
      marginTop:10,
      borderWidth:2,
      paddingLeft:10,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:25,
      backgroundColor:"grey",
      shadowColor:"#000",
      shadowOffset:{
          width:0,
          height:10,
      },
      shadowOpacity:0.3,
      shadowRadius:10,
      elevation:15,

     },
     loginButton:{
      height:40,
      width:200,
      borderRadius:10,
      borderWidth:1,
      marginTop:10,
      alignItems:'center',
      justifyContent:"center",
      backgroundColor:"#2a229c",
     },
     TitleText:{
       fontSize:60,
       textAlign:'center',
       color:"red",
       paddingBottom:20,


     }, 
     modalContainer:{
         flex:1,
         borderRadius:20,
         justifyContent:'center',
         alignItems:'center',
         marginRight:50,
         marginLeft:50,
         marginTop:100,
         marginBottom:100,
         backgroundColor:"yellow",
         
     },
     keyboardAvoidingView:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
     },
     modalTitle:{
         justifyContent:'center',
         alignSelf:'center',
         fontSize:35,
         color:"crimson",
         margin:50,
     },
     modalView:{
         justifyContent:'center',
         alignItems:'center',
     },
     modalButtons:{
         width:200,
         height:50,
         alignItems:'center',
         justifyContent:'center',
         marginTop:30,
         borderRadius:20,
         borderWidth:1,
     },
 })