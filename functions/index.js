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

    if (text.length > 1900) {
      text = text.substr(0, 1900);
      var ind = text.indexOf("\n");
      if (ind > 1890) {
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

exports.onInclementWeatherDay = functions.database
  .ref("/schedule/")
  .onUpdate((snapshot, _context) => {
    const date = snapshot.val();
    if (date.contains("inclement")) {
      var topic = "snowDay";
      const payload = {
        notification: {
          title: "Inclement Weather Day",
          body:
            "Transportation is cancelled and schools are be closed to students today. If you are attending secondary school in person, you will be moving to virtual learning for the day.",
          sound: "default",
          tag: "snowDay",
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
    }
    return console.log("Not an inclement weather day");
  });
