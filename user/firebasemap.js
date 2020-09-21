let map, infoWindow;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 10,
      styles: [{
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]  // Turn off points of interest.
      }, {
        featureType: 'transit.station',
        stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
      }],
      disableDoubleClickZoom: true,
      streetViewControl: false
    });

    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    loadShopData(map);
}

function makeInfoBox(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '100%';
    controlText.style.padding = '6px';
    controlText.innerText = 'みんなで飲食店をサポートしましょう！';
    controlUI.appendChild(controlText);
}


// Delete a ShopData from the UI.
function deleteShopData(id) {
    var div = document.getElementById(id);
    // If an element for that message exists we delete it.
    if (div) {
      div.parentNode.removeChild(div);
    }
}


// Displays a ShopData in the UI.
function displayShopData(map, id, name, lat, lng, goal) {

  var icon = {
    size: new google.maps.Size(8, 8),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };
  var marker = new google.maps.Marker({
    title: name,
    position: new google.maps.LatLng(lat, lng),
    icon: icon,
    map: map,
  });

  // add shop info -------
  var query = firebase.firestore()
    .collection("shoptoday")
    .where("店舗ID", "==", id);

  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    var accum = 0;
    snapshot.docChanges().forEach(function(change) {
      var data = change.doc.data();
      accum += data.来店客数;
    });

    var contentString = ''+
      '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">'+name+'</h1>'+
      '<div id="bodyContent">'+
      'HP: '+ accum+'/'+ goal;
    if (accum / goal <0.5) {
      contentString += '<img src="images/keieiNG.png" width="32" height="32" alt="" class="alignleft border" />'+
        '<br>お店は体力の限界です．'+
        '</div>'+
        '</div>';
    } else if (accum / goal >= 1) {
      contentString += '<img src="images/keieiOK.png" width="32" height="32" alt="" class="alignleft border" />'+
        '<br>お店は元気に営業中！'+
        '</div>'+
        '</div>';
    } else {
      contentString += '<img src="images/keieiNOMAL.png" width="32" height="32" alt="" class="alignleft border" />'+
        '<br>お店はなんとかなってます'+
        '</div>'+
        '</div>';
    }

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadShopData(map, ) {
    // TODO 8: Load and listens for new messages.
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore()
        .collection("shop");

    // Start listening to the query.
    query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
        if (change.type === 'removed') {
            deleteShopData(change.doc.id);
        } else {
            var data = change.doc.data();
            displayShopData(map, data.店舗ID, data.店舗名, data.緯度, data.経度, data.目標来客数);
        }
        });
    });
}
