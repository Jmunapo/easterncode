import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const counter = functions.database.ref('notifications/{userId}/{noteId}').onCreate(event => {
    const noteCId = event.data.val().itemid;
    const firedata = admin.database().ref('/counter/note');
    return firedata.child(noteCId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 }
        if (co) {
            co.num += 1;
            ob = co;
        } else {
            ob.num = 1
        }
        return admin.database().ref(`/counter/note/${noteCId}`).set(ob);
    });
});

export const uncount = functions.database.ref('notifications/{userId}/{noteId}').onUpdate(event => {
    const noteId = event.data.val().itemid;
    const firedata = admin.database().ref('/counter/note');
    return firedata.child(noteId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 }
        if (co) {
            if (co.num > 0) {
                co.num -= 1;
                ob = co;
            } else {
                co.num = 0;
                ob = co;
            }
        }
        if(ob.num === 0){
            return admin.database().ref(`/counter/note/${noteId}`).remove();
        }else{
            return admin.database().ref(`/counter/note/${noteId}`).set(ob);
        }
    });
});

export const projectcounter = functions.database.ref('letstalkabout/projects/{projectId}/{talkId}').onCreate(event => {
    const talkId = event.data.val().itemid;
    const counterdata = admin.database().ref('/counter/proj');
    return counterdata.child(talkId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 }
        if (co) {
            co.num += 1;
            ob = co;
        } else {
            ob.num = 1
        }
        return admin.database().ref(`/counter/proj/${talkId}`).set(ob)
    });
});

export const tutorialcounter = functions.database.ref('letstalkabout/tutorial/{subject}/{tutorialId}').onCreate(event => {
    const tutorId = event.data.val().itemid;
    const counterdata = admin.database().ref('/counter/tutorial');
    return counterdata.child(tutorId).once('value', (snapshot) => {
        const co = snapshot.val();
        let ob = { num: 0 }
        if (co) {
            co.num += 1;
            ob = co;
        } else {
            ob.num = 1
        }
        return admin.database().ref(`/counter/tutorial/${tutorId}`).set(ob)
    });
});