import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image, 
    KeyboardAvoidingView,Alert,TouchableHighlight, FlatList} from 'react-native';

import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books';

export default class BookRequestScreen extends React.Component{

    constructor(){
        super()
        this.state = {
            bookName: '',
            reasonForRequest:'',
            userID:firebase.auth().currentUser.email,
            isBookRequestActive:false,
            requestedBookName:"",
            bookStatus:"",
            docID:"",
            requestID:"",
            userDocID:"",
            dataSource:"",
            showFlatList:false,
            requestedImageLink: "", 

         }
    }

    async getBooksFromApi(bookName){
        this.setState({
            bookName:bookName
        })
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName,'AIzaSyB2VWDdGicwoHvULfjNAK_oLZ87dDNgT9M')
            this.setState({
                dataSource:books.data,
                showFlatList:true,
            })       
        }
    }

    createUniqueID(){
        return Math.random().toString(36).substring(7)
    }

    addRequest = async (bookName,reasonForRequest)=>{
        var userID = this.state.userID
        var randomRequestID = this.createUniqueID()
        var books = await BookSearch.searchbook(bookName,'AIzaSyB2VWDdGicwoHvULfjNAK_oLZ87dDNgT9M')
        db.collection('RequestedBooks').add({
            "userID":userID,
            "bookName":bookName,
            "reasonForRequest":reasonForRequest,
            "requestID":randomRequestID,
            "bookStatus":"Requested",
           "imageLink":books.data[0].volumeInfo.imageLinks.smallThumbnail 
        })

        await this.getBookRequest()
        db.collection('UsersCollection').where('emailID','==',userID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('UsersCollection').doc(doc.id).update({
                    isBookRequestActive:true,
            })
            })
        })
        this.setState({
            bookName: '',
            reasonForRequest:'',
            requestID:randomRequestID
        })
        return Alert.alert("Your Request For The Book Has Been Successfully done")    
    }

    getBookRequest = ()=>{
        var bookRequest = db.collection('RequestedBooks').where('userID','==',this.state.userID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().bookStatus !== "Recieved"){
                    this.setState({
                        requestID:doc.data().requestID,
                        requestedBookName:doc.data().bookName,
                        bookStatus:doc.data().bookStatus,
                        docID:doc.id,
                        requestedImageLink: doc.data().imageLink,
                    })
                }
            })
        })
    }

    receivedBooks = (bookName)=>{
        var userID = this.state.userID
        var requestID = this.state.requestID
        db.collection('ReceivedBooks').add({
            userID:userID,
            requestID:requestID,
            bookName:bookName,
            bookStatus:"Recieved",
        })
    }

    getIsBookReqActive(){
        db.collection('UsersCollection').where('emailID','==',this.state.userID)
        .onSnapshot(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    isBookRequestActive:doc.data().isBookRequestActive,
                    userDocID:doc.id,
                })
            })
        })    
    }

    componentDidMount(){
        this.getBookRequest()
        this.getIsBookReqActive()
        // var book =BookSearch.searchbook("game of thrones",'AIzaSyB2VWDdGicwoHvULfjNAK_oLZ87dDNgT9M') 
        // console.log(book)
    }

    updateBookRequest = ()=>{
        db.collection('RequestedBooks').doc(this.state.docID).update({
            bookStatus:"Received",
        })
        db.collection('UsersCollection').where('emailID','==',this.state.userID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('UsersCollection').doc(doc.id).update({
                    isBookRequestActive:false,
                })
            })
        })
    }

    sendNotifications = ()=>{
        db.collection('UsersCollection').where('emailID','==',this.state.userID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var firstName = doc.data().firstName
                var lastName = doc.data().lastName
                db.collection('allNotifications').where('requestID','==',this.state.requestID).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorID = doc.data().donorID
                        var bookName = doc.data().bookName
                        db.collection('allNotifications').add({
                            'targetUserID':donorID,
                            'message': firstName + " " + lastName + " Received The Book " + bookName,
                            'notificationStatus': "Unread",
                            'bookName': bookName,
                            'date':firebase.firestore.FieldValue.serverTimestamp()
                            
                        })
                    })
                })
                
            })
        })

    }

    renderItem = ({item,i})=>{
        let obj = {
            title: item.volumeInfo.title,
            selfLink: item.selfLink,
            buyLink: item.saleInfo.buyLink,
            imageLink: item.volumeInfo.imageLinks,
          };
          
        return(
            <TouchableHighlight
            style = {{alignItems:'center',padding:10,width:'90%',backgroundColor:'gray'}}
            activeOpacity = {0.6}
            underlayColor = 'gray'
            onPress = {()=>{
                this.setState({
                showFlatList:false,
                bookName:item.volumeInfo.title,
                })
            }}
            bottomDivider>
                <Text>
                    {item.volumeInfo.title}
                </Text>
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.isBookRequestActive === true){
            return(
                <View
                style = {{flex:1,justifyContent:'center'}}>
                    <View
                    style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text>
                            Book Name
                        </Text>
                        <Text>
                            {this.state.requestedBookName}
                        </Text>
                    </View>
                    <View
                    style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                        <Text>
                            Book Status
                        </Text>
                        <Text>
                            {this.state.bookStatus}
                        </Text>
                    </View>
                    <TouchableOpacity
                    style = {{backgroundColor:"gold",alignItems:'center',marginTop:30,width:300,height:30}}
                    onPress ={()=>{
                        this.sendNotifications()
                        this.updateBookRequest()
                        this.receivedBooks(this.state.requestedBookName)
                    }}>
                        <Text>
                            Recieved The Book
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <View
                style = {{flex:1}}>
                    <MyHeader 
                    title = "Request Books"
                    navigation = {this.props.navigation}/>

                <KeyboardAvoidingView>
                    <TextInput 
                        style = {styles.formsTextInput}
                        placeholder = {"Book Name"}
                        onChangeText = {(text)=>{
                             this.getBooksFromApi(text)
                            // this.setState({
                            //     bookName:text
                            // })
                        }}
                        onClear = {(text)=>{
                            this.getBooksFromApi("")
                        }}
                        value = {this.state.bookName}/>
                        {this.state.showFlatList?(
                            <FlatList
                            data = {this.state.dataSource}
                            renderItem = {this.renderItem}
                            keyExtractor = {(item,index)=>index.toString()}
                            style = {{marginTop:10,}}
                            enableEmptySections = {true}/>
                        ):
                        (
                            <View>
                                <TextInput
                                    style = {styles.formsTextInput}
                                    placeholder = {"Reason For Your Request"}
                                    multiline = {true}
                                    numberOfLines = {5}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            reasonForRequest:text,
                                            
                                        })
                                    }}
                                    value = {this.state.reasonForRequest}

                                />
                
                                <TouchableOpacity
                                    style = {styles.button}
                                    onPress = {()=>{
                                        this.addRequest(this.state.bookName,this.state.reasonForRequest)
                                        this.setState({
                                            bookName:"",
                                            reasonForRequest:"",
                                            
                                        })
                                    }}>
                                    <Text>
                                        Request
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    
                </KeyboardAvoidingView>
                    
                </View>
            
            )
        }
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