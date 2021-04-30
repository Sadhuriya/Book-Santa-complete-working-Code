import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image,FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader'

import{Card} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
export default class MyDonationsScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userID:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:'',
        }
        this.requestRef = null;
    }

    getDonorDetails = (donorID)=>{
        db.collection('UsersCollection').where('emailID','==',donorID).get()
        .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            this.setState({
                donorName:doc.data().firstName + " " + doc.data().lastName
            })
        })
        })
    }

    getAllDonations = ()=>{
        console.log(this.state.userID)
        this.requestRef = db.collection("MyDonation").where('donorID','==',this.state.userID)
        .onSnapshot((snapshot)=>{
            var allDonations = []
            snapshot.docs.map((doc)=>{
                var donation = doc.data()
                donation["docID"] = doc.id
                allDonations.push(donation)
            })
            this.setState({
                allDonations:allDonations
            })
        })
    }

    sendNotifications = (bookDetails,requestStatus)=>{
        console.log("donor Name", this.state.donorName)
        var requestID = bookDetails.requestID
        var donorID = bookDetails.donorID 
        db.collection('allNotifications').where('requestID','==',requestID).where('donorID','==',donorID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message = ""
                if(requestStatus==="Book Sent"){
                    message = this.state.donorName + " sent you the book"
                }else{
                    message = this.state.donorName + " has shown interest in donating the book"
                }
                db.collection('allNotifications').doc(doc.id).update({
                    'message': message,
                    'notificationStatus': "Unread",
                    'date':firebase.firestore.FieldValue.serverTimestamp()
                    
                })
            })
        })

    }
    sendBook = (bookDetails)=>{
        if(bookDetails.requestStatus === "Book Sent"){
            var requestStatus = "Donor Interested"
            console.log(bookDetails.docID)
            db.collection('MyDonation').doc(bookDetails.docID).update({
                "requestStatus": "Donor Interested"
            })
            this.sendNotifications(bookDetails,requestStatus)
        }else{
            var requestStatus = "Book Sent"
            db.collection('MyDonation').doc(bookDetails.docID).update({
                "requestStatus": "Book Sent"
            })
            this.sendNotifications(bookDetails,requestStatus)
        }
    }

    componentDidMount(){
        this.getAllDonations()
        this.getDonorDetails(this.state.userID)
    }

    componentWillUnmount(){
        this.requestRef()
    }

    keyExtractor = (item,index)=>index.toString()
    renderItem = ({item,i})=>{
        return(
            <ListItem 
            key={i} bottomDivider> 
                <ListItem.Content> 
                    <ListItem.Title style = {{ color: 'black', fontWeight: 'bold' }}>{item.bookName} </ListItem.Title> 
                    <ListItem.Subtitle>{"Requested By: " + item.requestedBy + "\nStatus:" + item.requestStatus}</ListItem.Subtitle> 
                </ListItem.Content> 
                <TouchableOpacity 
                style={[styles.button,{
                    backgroundColor : item.requestStatus === "Book Sent" ? "green" : "red"
                }]}
                onPress = {()=>{
                    this.sendBook(item)
                }}> 
                    <Text style={{color:'#ffff'}}>{
                        item.requestStatus === "Book Sent" ? "Book Sent" : "Send Book"
                    }</Text>
                </TouchableOpacity> 
            </ListItem>

        )
    }
    render(){
        return(
            <View
            style = {{flex:1}}>
                <MyHeader 
                    title = "My Donations"
                    navigation = {this.props.navigation}/>
                <View
                style = {{flex:1}}>
                    {
                        this.state.allDonations.length === 0 ? (
                            <View 
                            style = {styles.container}>
                                <Text
                                style = {{fontSize:15}}>
                                    List Of All Donated Books
                                </Text>
                            </View>
                        )
                        :(
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem = {this.renderItem}/>
                        )
                    }
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
})     
