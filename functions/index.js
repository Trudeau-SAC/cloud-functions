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
        click_action: "FLUTTER_NOTIFICATION_CLICK",
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
        body: messageData["message"],
        sound: "default",
        tag: messageData["topic"],
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        index: snapshot.key,
      },
    };

    if (messageData["screen"] !== "N/A") {
      payload["data"]["screen"] = messageData["screen"];
    }

    if (messageData["title"] !== "N/A") {
      messageData["notification"]["title"] = messageData["title"];
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
