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
    

 $("#send_button").on("click", send_mess);
 $("#logout_button").on("click", logout);


function send_mess(){
var ma_num = document.getElementById("maleNumber").value; 
var fi_num = document.getElementById("femaleNumber").value;
var chi_num = document.getElementById("childNumber").value;
var sum_num =  Number(ma_num) + Number(fi_num) + Number(chi_num);


var time_stamp = firebase.firestore.FieldValue.serverTimestamp();
console.log(time_stamp);
 db.collection("shoptoday").add({
    店舗ID: uid,
    来店客数: sum_num,
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


function get_loc() {      
    // ユーザーの端末がGeoLocation APIに対応しているかの判定
    // 対応している場合
    var lat;
    var lng;

    if( navigator.geolocation )
    {
       // 現在地を取得
       navigator.geolocation.getCurrentPosition(

          // [第1引数] 取得に成功した場合の関数
          function( position )
          {
             // 取得したデータの整理
             var data = position.coords ;

             // データの整理
             lat = data.latitude ;
             lng = data.longitude ;
             return lat, lng;
          }
          ,

          // [第2引数] 取得に失敗した場合の関数
          function( error )
          {
             // エラーコード(error.code)の番号
             // 0:UNKNOWN_ERROR				原因不明のエラー
             // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
             // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
             // 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…

             // エラー番号に対応したメッセージ
             var errorInfo = [
                "原因不明のエラーが発生しました…。" ,
                "位置情報の取得が許可されませんでした…。" ,
                "電波状況などで位置情報が取得できませんでした…。" ,
                "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
             ] ;

             // エラー番号
             var errorNo = error.code ;

             // エラーメッセージ
             var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;

             // アラート表示
             alert( errorMessage ) ;

          } ,

          // [第3引数] オプション
          {
             "enableHighAccuracy": false,
             "timeout": 8000,
             "maximumAge": 2000,
          }

       ) ;
    }

    // 対応していない場合
    else
    {
       // エラーメッセージ
       var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。" ;

       // アラート表示
       alert( errorMessage ) ;

    }
    }