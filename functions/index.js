const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewAnnouncement = functions.database
  .ref("/announcements/{date}")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    const date = snapshot.key;
    var topic = "announcements";
    const payload = {
      notification: {
        title: "New Announcements for " + date.substr(date.indexOf(" ") + 1),
        body: messageData.join("\n"),
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

exports.oneNewNotification = functions.database
  .ref("/notifications/{index}")
  .onCreate((snapshot, _context) => {
    const messageData = snapshot.val();
    var topic = messageData["topic"];
    const payload = {
      notification: {
        title: messageData["title"],
        body: messageData["message"],
        sound: "default",
        tag: messageData["topic"],
      },
      data: {
        FLUTTER_NOTIFICATION_CLICK: "1",
        index: snapshot.key,
      },
    };

    if (messageData.hasOwnProperty("screen")) {
      payload["data"]["screen"] = messageData["screen"];
    }

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
