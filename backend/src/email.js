const db = require('./db');

exports.getAll = async (req, res) => {
  const re = await db.selectMails(req.user.email);

  re.sort(function(a, b) {
    return b.received > a.received ? 1 : -1;
  });

  let curr; let curD;
  const today = new Date();
  const td = today.toISOString();
  let ytd = new Date(); ytd.setDate(ytd.getDate() - 1);
  ytd = ytd.toISOString();
  let twMonth = new Date(); twMonth.setFullYear(twMonth.getFullYear() - 1);
  twMonth = twMonth.toISOString();

  for (let i = 0; i < re.length; i++) {
    curr = re[i].received;
    curD = new Date(curr);
    if (curr < twMonth) {
      re[i].received = curD.getFullYear().toString();
    } else if (curr < ytd) {
      re[i].received =
        curD.toLocaleDateString('en-us', {month: 'short', day: '2-digit'});
    } else if (curr < td) {
      re[i].received = 'Yesterday';
    } else {
      re[i].received =
        curD.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    }
  }

  res.status(200).send(re);
};
