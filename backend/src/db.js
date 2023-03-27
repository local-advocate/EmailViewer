const {Pool} = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.login = async (email, pwd) => {
  const select =
    'SELECT pname, email, hash, avatar FROM people WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  if (rows.length == 0 ||
    !bcrypt.compareSync(pwd, rows[0].hash)) return undefined;
  else return [rows[0].pname, rows[0].avatar];
};

getAvatar = async (email) => {
  const select = 'SELECT avatar FROM people WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  return rows[0].avatar;
};

exports.selectMails = async (usr) => {
  const select = 'SELECT mail FROM mail ' +
    'WHERE (mailbox = \'Inbox\' AND mail->\'to\'->>\'email\' = $1)';
  const query = {
    text: select,
    values: [usr],
  };
  const {rows} = await pool.query(query);
  const mails = [];
  for (const row of rows) {
    row.mail['avatar'] = await getAvatar(row.mail.from.email);
    mails.push(row.mail);
  }
  return mails;
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
