// Cloud Functions for Firebase SDK
const functions = require("firebase-functions");

// Firebase Admin SDK to access RTDB
const admin = require("firebase-admin");
admin.initializeApp();

// redeploy all functions: firebase deploy --only functions

/**
 *  Announcements notification
 *  Sends a notification upon new entry in announcements index in RTDB
 * Deploy: firebase deploy --only functions:onNewAnnouncement
 */
exports.onNewAnnouncement = functions.database
  .ref("/announcements/{date}")
  .onCreate((snapshot, _context) => {
    // store child value
    const messageDataUnprocessed = snapshot.val();
    const date = snapshot.key;
    const messageData = messageDataUnprocessed.filter(link => !link.startsWith("https://drive.google.com"));
    var topic = "announcements";
    // declare payload
    const payload = {
      notification: {
        title: "New Announcements for " + date.substr(date.indexOf(" ") + 1),
        body: messageData.join("\n"),
        sound: "default",
        tag: "announcements",
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        screen: "/home-announcements",
      },
    };

    //send notification
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

/**
 * Regular notification
 * Sends a notification upon new entry in notifications index in RTDB
 * Deploy: firebase deploy --only functions:oneNewNotification
 */
exports.oneNewNotification = functions.database
  .ref("/notifications/{index}")
  .onCreate((snapshot, _context) => {
    // store child value
    const messageData = snapshot.val();
    var topic = messageData["topic"];
    // declare payload
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

    // if the screen isn't N/A, declare the screen
    if (messageData["screen"] !== "N/A") {
      payload["data"]["screen"] = messageData["screen"];
    }

    // if the title isn't N/A, declare the title
    if (messageData["title"] !== "N/A") {
      payload["notification"]["title"] = messageData["title"];
    }

    //send notification
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

/**
 * Club of the Week notification
 * Sends a notification upon new entry in clubs index in RTDB
 * Deploy: firebase deploy --only functions:onNewClub
 */
exports.onNewClub = functions.database
  .ref("/clubs/{name}")
  .onCreate((snapshot, _context) => {
    // store child value
    const messageData = snapshot.val();
    const name = snapshot.key;
    //check if there is a club of the week
    if (name !== "None") {
      var topic = "clubs";
      // declare payload
      const payload = {
        notification: {
          title: "Club of the Week: " + name,
          body: messageData["Text"],
          sound: "default",
          tag: "clubs",
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          screen: "/home-clubs",
        },
      };

      //send notification
      return admin
        .messaging()
        .sendToTopic(topic, payload)
        .then((response) => {
          return console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          return console.log("Error sending message:", error);
        });
    }

    // if no club of the week, don't send a notification
    return console.log("No Club of the Week");
  });
