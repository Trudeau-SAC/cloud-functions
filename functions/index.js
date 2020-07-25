const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("/announcements")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    console.log(messageData);
    const text = messageData.join(" ");
    console.log(text);

    var topic = "announcements";
    const payload = {
      notification: {
        title: "Today's Announcements",
        body: text,
        sound: "default",
      },
      data: {
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
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
