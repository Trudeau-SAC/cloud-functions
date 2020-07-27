const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("/announcements/{date}")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    const date = snapshot.key;
    const text = messageData.join("\n");
    text.replace(/\n+$/, "");

    var topic = "announcements";
    const payload = {
      notification: {
        title: "New Announcements for " + date.substr(date.indexOf(" ") + 1),
        body: text,
        sound: "default",
      },
      data: {
        FLUTTER_NOTIFICATION_CLICK: "1",
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
