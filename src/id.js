var prevTime = 0;
var counter = 0;

function id() {
  var t = Date.now();
  var s = t.toString(36);
  if (t == prevTime) {
    counter += Math.floor(Math.random() * 100);
    s += '-' + counter.toString(36)
  } else {
    counter = 0;
  }
  prevTime = t;
  var a = [];
  for (let i = 0; i < s.length; i++) {
    if (Math.random() < 0.5) {
      a.push(s[i].toLowerCase());
    } else {
      a.push(s[i].toUpperCase());
    }
  }
  return a.join('');
}

export default id;
