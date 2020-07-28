const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("/announcements/{date}")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    const date = snapshot.key;
    var text = messageData.join("\n");
    text.replace(/\n+$/, "");

    if (text.length > 3900) {
      text = text.substr(0, 3900);
      var ind = text.indexOf("\n");
      if (ind > 3890) {
        text = text.substr(0, ind);
      }
      text += "...";
    }

    var topic = "announcements";
    const payload = {
      notification: {
        title: "New Announcements for " + date.substr(date.indexOf(" ") + 1),
        body: text,
        sound: "default",
        tag: "announcements",
      },
      data: {
        FLUTTER_NOTIFICATION_CLICK: "1",
        screen: "/home",
      },
    };

    return admin
      .messaging()
      .sendToTopic(topic, payload)
      .then((response) => {
        return console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        return console.log("Error sending message:", error);
      });
  });
