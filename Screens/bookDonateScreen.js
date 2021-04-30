import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,FlatList,Image} from 'react-native';

import {ListItem} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
export default class BookDonateScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            requestedBooksList:[]
        }
        this.requestRef = null
    }

    getRequestBookList =()=>{
        this.requestRef = db.collection("RequestedBooks")
        .onSnapshot((snapshot)=>{
            var requestedBooksList = snapshot.docs.map(document => document.data())
            this.setState({
                requestedBooksList:requestedBooksList
            })
        })
    }

    componentDidMount(){
        this.getRequestBookList()
    }

    componentWillUnmount(){
        this.requestRef()
    }

    keyExtractor = (item,index)=>index.toString()
    renderItem = ({item,i})=>{
        return(
            <ListItem 
            key={i} bottomDivider>
                <Image
                style = {{height:50,width:50}}
                source = {{uri:item.imageLink}}/> 
                <ListItem.Content> 
                    <ListItem.Title style = {{ color: 'black', fontWeight: 'bold' }}>{item.bookName} </ListItem.Title> 
                    <ListItem.Subtitle>{item.reasonForRequest}</ListItem.Subtitle> 
                </ListItem.Content> 
                <TouchableOpacity 
                style={styles.button}
                onPress = {()=>{
                    this.props.navigation.navigate('RecieverDetails',{'details':item})
                }}> 
                    <Text style={{color:'#ffff'}}>
                        View
                    </Text>
                </TouchableOpacity> 
            </ListItem>

        )
    }
    


    render(){
        return(
            <View
            style = {{flex:1}}>
                <MyHeader 
                    title = "Donate Books"
                    navigation = {this.props.navigation}/>
                <View
                style = {{flex:1}}>
                    {
                        this.state.requestedBooksList.length === 0 ? (
                            <View 
                            style = {styles.container}>
                                <Text
                                style = {{fontSize:15}}>
                                    List Of All Requested Books
                                </Text>
                            </View>
                        )
                        :(
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.requestedBooksList}
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
