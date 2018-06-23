"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.counter = functions.database.ref('notifications/{userId}/{noteId}').onCreate(event => {
    const noteCId = event.data.val().itemid;
    const firedata = admin.database().ref('/counter/note');
    return firedata.child(noteCId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 };
        if (co) {
            co.num += 1;
            ob = co;
        }
        else {
            ob.num = 1;
        }
        return admin.database().ref(`/counter/note/${noteCId}`).set(ob);
    });
});
exports.uncount = functions.database.ref('notifications/{userId}/{noteId}').onUpdate(event => {
    const noteId = event.data.val().itemid;
    const firedata = admin.database().ref('/counter/note');
    return firedata.child(noteId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 };
        if (co) {
            if (co.num > 0) {
                co.num -= 1;
                ob = co;
            }
            else {
                co.num = 0;
                ob = co;
            }
        }
        if (ob.num === 0) {
            return admin.database().ref(`/counter/note/${noteId}`).remove();
        }
        else {
            return admin.database().ref(`/counter/note/${noteId}`).set(ob);
        }
    });
});
exports.projectcounter = functions.database.ref('letstalkabout/projects/{projectId}/{talkId}').onCreate(event => {
    const talkId = event.data.val().itemid;
    const counterdata = admin.database().ref('/counter/proj');
    console.log(talkId);
    return counterdata.child(talkId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 };
        if (co) {
            co.num += 1;
            ob = co;
        }
        else {
            ob.num = 1;
        }
        return admin.database().ref(`/counter/proj/${talkId}`).set(ob);
    });
});
//# sourceMappingURL=index.js.map