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

    //新規登録処理
    sign_up_button.addEventListener('click', function(e) {
    var mailAddress = document.getElementById('mailAddress').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
    .catch(function(error) {
        alert('登録できません（' + error.message + '）');
    });
    });

    //ログイン処理
    login_button.addEventListener('click', function(e) {
    var mailAddress = document.getElementById('mailAddress').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(mailAddress, password)
    .catch(function(error) {
        alert('ログインできません（' + error.message + '）');
    });
    });

    //認証状態の確認
    firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        //ログイン状態
        alert("ログインに成功しました");
        window.location.href = "./home.html";
    }else{
        console.log("ログアウト状態")
        //ログアウト状態
    }
    });
  