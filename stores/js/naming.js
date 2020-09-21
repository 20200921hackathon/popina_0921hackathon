var firebaseConfig = {
    apiKey: "AIzaSyDc1rdptdFeoAaYnLNXuYGISV0cG9-1Va4",
    authDomain: "popina-prj.firebaseapp.com",
    databaseURL: "https://popina-prj.firebaseio.com",
    projectId: "popina-prj",
    storageBucket: "popina-prj.appspot.com",
    appId: "1:50074837161:web:65575af9ed315d3ea2c9b8",
 };

 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 firebase.analytics();
 var db = firebase.firestore();
 var uid;

      //認証状態の確認
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
           //ログイン状態
           uid = user.uid;

        }else{
           //ログアウト状態
           alert("ログインしてください");
           window.location.href = "./index.html";
        }
        });


$("#decide_button").on("click", setting);

function setting () {
var new_name = String(document.getElementById("new_name").value);
var goal = document.getElementById("goal").value;
var latitude = document.getElementById("lat").value;
var longitude = document.getElementById("lng").value;


if(new_name.length == 0) {
      console.log("kake!");
      document.getElementById('result0').textContent = "何か書きなさいな";
   }
else{
   var user = firebase.auth().currentUser;
   // var loc =  firebase.firestore.GeoPoint(latitude, longitude)
   user.updateProfile({
   displayName: new_name,
   }).then(function() {
    db.collection("shop").add({
        店舗名:new_name,
        店舗ID:uid,
       目標来客数:goal,
       緯度:latitude,
       経度:longitude
   })
   .then(function(docRef) {
       console.log("Document written with ID: ", docRef.id);
          // Update successful.
        alert("初回設定を完了しました");
        window.location.href = "./home.html";
   })
   .catch(function(error) {
       console.error("Error adding document: ", error);
   });
   
   }).catch(function(error) {
   // An error happened.
   alert('なんかエラってます（' + error.message + '）');

   });


}
}





