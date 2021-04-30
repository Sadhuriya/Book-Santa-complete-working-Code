import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity} from 'react-native';

import {DrawerItems} from 'react-navigation-drawer';

import firebase from 'firebase'
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import db from "../config";

export default class SideBarMenu extends React.Component{
    state = {
        userId: firebase.auth().currentUser.email,
        image: "#",
        name: "",
        docId: "",
      };
      selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!cancelled) {
          this.uploadImage(uri, this.state.userId);
        }
      };

      uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();
    
        var ref = firebase
          .storage()
          .ref()
          .child("userProfiles/" + imageName);
    
        return ref.put(blob).then((response) => {
          this.fetchImage(imageName);
        });
      };
      fetchImage = (imageName) => {
        var storageRef = firebase
          .storage()
          .ref()
          .child("userProfiles/" + imageName);
    
        // Get the download URL
        storageRef
          .getDownloadURL()
          .then((url) => {
            this.setState({ image: url });
          })
          .catch((error) => {
            this.setState({ image: "#" });
          });
      };
      getUserProfile() {
        db.collection("UsersCollection")
          .where("emailID", "==", this.state.userId)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({
                name: doc.data().firstName + " " + doc.data().lastName,
                docId: doc.id,
                image: doc.data().image,
              });
            });
          });
      }

      componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
      }
    
    render(){
        return(
            <View
            style = {styles.container}>
                 <View
          style={{
            flex: 0.5,

            alignItems: "center",
            backgroundColor: "orange",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="medium"
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />

          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
                <View
                style = {styles.drawerItemContainer}>
                    <DrawerItems
                    {...this.props}/>
                </View>
                <View
                style = {styles.logoutContainer}>
                    <TouchableOpacity
                    style = {styles.logoutButton}>
                        <Text
                        style = {styles.logoutText}
                        onPress = {()=>{
                            this.props.navigation.navigate('WelcomeScreen')
                            firebase.auth().signOut()
                        }}>
                            Logout
                        </Text>
                    </TouchableOpacity>  
                </View>
            </View>
        )
    }
    
}
const styles = StyleSheet.create({
    container:{
        flex:1,
       },
    drawerItemContainer:{
        flex:0.8,
        paddingTop:30,
    },
    logoutContainer:{
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:20,
    },
    logoutButton:{
        height:30,
        width:'100%',
        justifyContent:'center',
        padding:10,
    },
    imageContainer: {
        flex: 0.75,
        width: "40%",
        height: "20%",
        marginLeft: 20,
        marginTop: 30,
        borderRadius: 40,
      },
    logoutText:{
        fontSize:30,
        fontWeight:'bold',
    },
})     