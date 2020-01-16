const UID_KEY = '__uid';

function setUid(value) {
    uid = value;
    localStorage.setItem(UID_KEY, uid);
}

let uid = +localStorage.getItem(UID_KEY);

if (!uid) {
    setUid(1);
}

export default function getuid() {
    setUid(uid + 1);
    return uid;
}
