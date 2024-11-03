const better = require("better-sqlite3");
const DBNAME = "beans.db";

module.exports.InitDB = () => {
  var database = better(DBNAME);

  // Execute SQL statements from strings.
  database.exec(`
	CREATE TABLE IF NOT EXISTS cuties(
	  id INTEGER PRIMARY KEY,
	  name TEXT
	) STRICT
  `);

  database.exec(`
	CREATE TABLE IF NOT EXISTS keyboard_smashes(
	  smash_id INTEGER PRIMARY KEY,
	  user_id INTEGER,
	  keyboard TEXT,
	  FOREIGN KEY(user_id) REFERENCES cuties(id)
	) STRICT
  `);

  database.close();
};

module.exports.AddName = (userID, name) => {
  let db = better(DBNAME);
  let insert = db.prepare(
	"INSERT or REPLACE INTO cuties (id, name) VALUES (?, ?)",
  );
  // Execute the prepared statement with bound values.
  insert.run(userID, name);
  db.close();
};

module.exports.GetNames = () => {
  let db = better(DBNAME);
  let select = db.prepare("SELECT * FROM cuties");
  // Execute the prepared statement and bind values.
  let names = select.all();
  db.close();
  return names;
};

module.exports.GetKeyboardSmashes = (userID, pagenum = 0) => {
  // Sends 10 keyboard smashes per page
  let db = better(DBNAME);
  let select = db.prepare(
	"SELECT * FROM keyboard_smashes WHERE user_id == " +
	  userID +
	  " ORDER BY smash_id DESC LIMIT 10 OFFSET " +
	  pagenum * 10,
  );
  let smashes = select.all();
  db.close();
  return smashes;
};

module.exports.GetAllKeyboardSmashes = (pagenum = 0) => {
  // Sends 10 keyboard smashes per page
  let db = better(DBNAME);
  console.log("SELECT * FROM keyboard_smashes ORDER BY smash_id DESC LIMIT 10 OFFSET " + (pagenum * 10));
  let select = db.prepare(
	"SELECT * FROM keyboard_smashes ORDER BY smash_id DESC LIMIT 10 OFFSET " +
	  (pagenum * 10),
  );
  let smashes = select.all();
  db.close();
  return smashes;
};

module.exports.AddKeyboardSmash = (userID, keyboard) => {
  try {
	let db = better(DBNAME);
	let insert = db.prepare(
	  "INSERT or REPLACE INTO keyboard_smashes (smash_id, user_id, keyboard) VALUES (?, ?, ?)",
	);
	insert.run(null, userID, keyboard);
	console.log(userID, keyboard);
	// Execute the prepared statement and bind values.
	let names = select.all();
	db.close();
  } catch {
	return 500;
  }
  return 200;
};

module.exports.GetAmounts = () => {
  let db = better(DBNAME);
  let row = db.prepare("SELECT user_id,COUNT(*) AS count FROM keyboard_smashes GROUP BY user_id");
  data = row.all();
  return data;
};

