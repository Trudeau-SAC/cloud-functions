const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("announcements")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
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

    admin
      .messaging()
      .sendToTopic(topic, payload)
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  });
