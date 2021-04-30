import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image, KeyboardAvoidingView,Alert,ToastAndroid,Modal,ScrollView} from 'react-native';

import MyHeader from '../components/MyHeader'

import{Card} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
export default class RecieverDetailsScreen extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            userID:firebase.auth().currentUser.email,
            receiverID:this.props.navigation.getParam('details')["userID"],
            requestID:this.props.navigation.getParam('details')["requestID"],
            bookName:this.props.navigation.getParam('details')["bookName"],
            reasonForRequest:this.props.navigation.getParam('details')["reasonForRequest"],
            receiverName:'',
            receiverContact:'',
            receiverAddress:'',
            receiverRequestDocID:'',
            userName:'',
        }
    }

    addNotifications = ()=>{
        var message = this.state.userName + " Has shown Interest in Donating His/Her Book"
        db.collection('allNotifications').add({
            'donorID':this.state.userID,
            'targetedUserID':this.state.receiverID,
            'requestID':this.state.requestID,
            'bookName':this.state.bookName,
            'date':firebase.firestore.FieldValue.serverTimestamp(),
            'notificationStatus':"Unread",
            'message':message,
        }) 
    }

    getUserDetails(userID){
        db.collection("UsersCollection").where('emailID','==',userID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    userName:doc.data().firstName + " " + doc.data().lastName
                })
            })
        })
    }

    getReceiverDetails(){
        db.collection("UsersCollection").where('emailID','==',this.state.receiverID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName:doc.data().firstName,
                    receiverContact:doc.data().contact,
                    receiverAddress:doc.data().address,
                })
            })
        })
        db.collection("RequestedBooks").where('requestID','==',this.state.requestID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverRequestDocID:doc.id,
                })
            })
        })
        
    }

    componentDidMount(){
        this.getReceiverDetails()
        this.getUserDetails(this.state.userID)
    }


    updateBookStatus = ()=>{
        db.collection('MyDonation').add({
            bookName:this.state.bookName,
            requestID:this.state.requestID,
            requestedBy:this.state.receiverName,
            donorID:this.state.userID,
            requestStatus:"Donor Intrested"
        })
    }
    render(){
        return(
            <View
            style = {styles.container}>
                <View
                style = {{flex:0.3}}>
                    <Card
                    title = {"Book Information"}
                    titleStyle = {{fontSize:20}}>
                        <Card>
                            <Text
                            style = {{fontWeight:'bold'}}>
                                Name:{this.state.bookName}
                            </Text>
                        </Card>
                        <Card>
                            <Text
                            style = {{fontWeight:'bold'}}>
                                Reason:{this.state.reasonForRequest}
                            </Text>
                        </Card>  
                    </Card>
                </View>
                <View
                style = {{flex:0.3}}>
                    <Card
                    title = {"Receiver Information"}
                    titleStyle = {{fontSize:20}}>
                        <Card>
                            <Text
                            style = {{fontWeight:'bold'}}>
                                Name:{this.state.receiverName}
                            </Text>
                        </Card>
                        <Card>
                            <Text
                            style = {{fontWeight:'bold'}}>
                                Address:{this.state.receiverAddress}
                            </Text>
                        </Card>
                        <Card>
                            <Text
                            style = {{fontWeight:'bold'}}>
                                Contact:{this.state.receiverContact}
                            </Text>
                        </Card>
                    </Card>
                </View>
                <View
                style = {styles.buttonContainer}>
                    {
                    this.state.receiverID !== this.state.userID ?(
                        <TouchableOpacity
                        style = {styles.button}
                        onPress = {()=>{
                            this.updateBookStatus()
                            this.addNotifications()
                            this.props.navigation.navigate('MyDonations')
                        }}>
                            <Text>
                                I Want To Donate
                            </Text>
                        </TouchableOpacity>
                    )
                    :null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
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
    buttonContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
})