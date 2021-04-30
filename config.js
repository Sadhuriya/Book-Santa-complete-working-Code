  // import * as firebase from 'firebase'
  import firebase from 'firebase/app'
  require('@firebase/firestore')

  var firebaseConfig = {
    apiKey: "AIzaSyBbqy6PO1JXfdL5b2IfK6BLFmrInWExU6s",
    authDomain: "bsapp-eddd8.firebaseapp.com",
    projectId: "bsapp-eddd8",
    storageBucket: "bsapp-eddd8.appspot.com",
    messagingSenderId: "780795132692",
    appId: "1:780795132692:web:046b972936943f93cfa001"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()
