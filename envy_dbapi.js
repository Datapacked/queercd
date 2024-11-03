const better = require("better-sqlite3");
const DBNAME = "./pages/gayfrogs/envy/envy.db";

const GENDER = {
  'feminine': 0,
  'androgynous': 1,
  'masculine': 2,
  'agender': 3,
};

module.exports.GENDER = GENDER;

// Redo all of this jazz

/**
 * @brief Initialized database
 */
module.exports.InitDB = () => {
  var database = better(DBNAME);

  // Execute SQL statements from strings.
  database.exec(`
	CREATE TABLE IF NOT EXISTS envy(
	  id INTEGER PRIMARY KEY,
    gender INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
	  img_url TEXT NOT NULL,
    tags TEXT NOT NULL
	) STRICT
  `);

  database.close();
};

/**
 * @brief Adds an envy post
 * 
 * @param {String} img_url 
 * @param {BigInt} gender 
 * @param {String} tags 
 * @returns {BigInt} status
 */
module.exports.AddEnvy = (img_url, gender, tags) => {
  try {
    let db = better(DBNAME);
    let insert = db.prepare(
    "INSERT or REPLACE INTO envy (img_url, gender, tags) VALUES (?, ?, ?)",
    );
    // Execute the prepared statement with bound values.
    insert.run(img_url, gender, tags);
    db.close();
  } catch {
    return 500;
  }
  return 200;
};

/**
 * @brief Gets specific post
 * 
 * @param {BigInt} id 
 * @returns {BigInt} status
 */
module.exports.GetPost = (id) => {
  // Sends N posts
  let db = better(DBNAME);
  let query = ("SELECT * FROM envy WHERE id = " + id);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Increments post score
 * 
 * @param {BigInt} id 
 * @returns {BigInt} status
 */
module.exports.UpvotePost = (id) => {
  try {
    let db = better(DBNAME);
    let upvote = db.prepare("UPDATE envy SET score = score + 1 WHERE id = ?");
    // Execute the prepared statement and bind values.
    upvote.run(id);
    db.close();
  } catch {
    return 500;
  }
  return 200;
};

/**
 * @brief Decrements post score
 * 
 * @param {BigInt} id 
 * @returns {BigInt} status
 */
module.exports.DownvotePost = (id) => {
  try {
    let db = better(DBNAME);
    let upvote = db.prepare("UPDATE envy SET score = score - 1 WHERE id = ?");
    // Execute the prepared statement and bind values.
    upvote.run(id);
    db.close();
  } catch {
    return 500;
  }
  return 200;
};

/**
 * @brief Gets all posts
 * 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetAllPosts = (pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  let query = (
    "SELECT * FROM envy ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Gets all posts of certain gender
 * 
 * @param {BigInt} gender 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetPostsGender = (gender, pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  let query = (
    "SELECT * FROM envy WHERE gender == " +
      gender +
      " ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Gets all posts that match all specified tags
 * 
 * @param {String} tags 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetPostsAnd = (tags, pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  var criteria = "";
  tags.split(',').forEach((k, i) => {
    criteria = criteria + " tags LIKE \'%" + k + "%\' AND";
  });
  criteria = criteria.substring(0, criteria.length - 4);
  let query = (
    "SELECT * FROM envy WHERE" + criteria +
      " ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Gets all posts that match one of the specified tags
 * 
 * @param {String} tags 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetPostsOr = (tags, pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  var criteria = "";
  tags.split(',').forEach((k, i) => {
    criteria = criteria + " tags LIKE \'%" + k + "%\' OR";
  });
  criteria = criteria.substring(0, criteria.length - 4);
  let query = (
    "SELECT * FROM envy WHERE" + criteria +
      " ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Gets all posts that have a certain gender and match all specified tags
 * 
 * @param {BigInt} gender 
 * @param {String} tags 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetPostsGenderAnd = (gender, tags, pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  var criteria = "";
  tags.split(',').forEach((k, i) => {
    criteria = criteria + " tags LIKE \'%" + k + "%\' AND";
  });
  criteria = criteria.substring(0, criteria.length - 4);
  let query = (
    "SELECT * FROM envy WHERE gender == " +
      gender + " AND" + criteria +
      " ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

/**
 * @brief Gets all posts that have a certain gender and match one of the specified tags
 * 
 * @param {BigInt} gender 
 * @param {String} tags 
 * @param {BigInt} pagenum 
 * @param {BigInt} pagesize 
 * @returns {Object} posts
 */
module.exports.GetPostsGenderOr = (gender, tags, pagenum = 0, pagesize = 50) => {
  // Sends N posts
  let db = better(DBNAME);
  var criteria = "";
  tags.split(',').forEach((k, i) => {
    criteria = criteria + " tags LIKE \'%" + k + "%\' OR";
  });
  criteria = criteria.substring(0, criteria.length - 4);
  let query = (
    "SELECT * FROM envy WHERE gender == " +
      gender + " AND (" + criteria +
      ") ORDER BY score DESC LIMIT " + pagesize + " OFFSET " +
      pagenum * pagesize);
  // console.log(query);
  let select = db.prepare(query,);
  let posts = select.all();
  db.close();
  return posts;
};

