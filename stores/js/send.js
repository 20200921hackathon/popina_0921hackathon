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


//認証状態の確認
firebase.auth().onAuthStateChanged(function(user) {

if(user) {
    //ログイン状態
    // display_name = user.displayName;
    if (user.displayName == null){
        alert("初回ログインです！情報入力をお願いします。");
        window.location.href = "./naming.html";
    }
    uid = user.uid;
    console.log("ログインしてます");
}else{
    //ログアウト状態
    alert("ログインしてください");
    window.location.href = "./index.html";
}
});
    

 $("#count_up_button").on("click", send_mess);
 $("#logout_button").on("click", logout);


function send_mess(){
var time_stamp = firebase.firestore.FieldValue.serverTimestamp();
console.log(time_stamp);
 db.collection("shoptoday").add({
    店舗ID: uid,
    来店客数: 1,
    来店日時: time_stamp
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
}

function logout () {
        firebase.auth().onAuthStateChanged( (user) => {
        firebase.auth().signOut().then(()=>{
           alert("ログアウトしました");
           window.location.href = "./index.html";
        })
        .catch( (error)=>{
           alert(`ログアウト時にエラーが発生しました (${error})`);
        });
        });
}