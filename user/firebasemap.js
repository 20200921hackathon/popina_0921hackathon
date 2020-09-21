function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 3,
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

    // Create the DIV to hold the control and call the makeInfoBox() constructor
    // passing in this DIV.
    var infoBoxDiv = document.createElement('div');
    infoBoxDiv.id = 'infobox';
    //var infoBox = new makeInfoBox(infoBoxDiv, map);
    infoBoxDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

    loadShopData(infoBoxDiv);
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


// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

function createAndInsertMessage(parentDiv, id, timestamp) {
    const container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    const div = container.firstChild;
    div.setAttribute('id', id);
  
    // If timestamp is null, assume we've gotten a brand new message.
    // https://stackoverflow.com/a/47781432/4816918
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp', timestamp);
  
    // figure out where to insert new message
    const existingMessages = parentDiv.children;
    if (existingMessages.length === 0) {
        parentDiv.appendChild(div);
    } else {
      let messageListNode = existingMessages[0];
  
      while (messageListNode) {
        const messageListNodeTime = messageListNode.getAttribute('timestamp');
  
        if (!messageListNodeTime) {
          throw new Error(
            `Child ${messageListNode.id} has no 'timestamp' attribute`
          );
        }
  
        if (messageListNodeTime > timestamp) {
          break;
        }
  
        messageListNode = messageListNode.nextSibling;
      }
  
      parentDiv.insertBefore(div, messageListNode);
    }
  
    return div;
}
  
// Displays a ShopData in the UI.
function displayShopData(infoBoxDiv, id, timestamp, name, text) {
    var div = createAndInsertMessage(infoBoxDiv, id, timestamp);

    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
  
    if (text) { // If the message is text.
      messageElement.textContent = text;
      // Replace all line breaks by <br>.
      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }

    // Show the card fading-in and scroll to view the new message.
    setTimeout(function() {div.classList.add('visible')}, 1);
    infoBoxDiv.scrollTop = infoBoxDiv.scrollHeight;

    infoBoxDiv.appendChild(div);
}

// Loads chat messages history and listens for upcoming ones.
function loadShopData(infoBoxDiv) {
    // TODO 8: Load and listens for new messages.
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore()
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(12);

    // Start listening to the query.
    query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
        if (change.type === 'removed') {
            deleteShopData(change.doc.id);
        } else {
            var data = change.doc.data();
            displayShopData(infoBoxDiv, change.doc.id, data.timestamp, data.name, data.text);
        }
        });
    });
}
