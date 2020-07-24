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

    //admin.messaging().sendToTopic(topic);
  });
