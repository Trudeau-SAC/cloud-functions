const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("/announcements/{date}")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    const text = messageData.join("\n");

    var topic = "announcements";
    const payload = {
      notification: {
        title: "Today's Announcements",
        body: text,
        sound: "default",
      },
      data: {
        FLUTTER_NOTIFICATION_CLICK: 1,
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
