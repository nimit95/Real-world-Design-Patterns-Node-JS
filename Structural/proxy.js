class DatabaseBase {
  query() {
  }
}

class Database extends DatabaseBase {
  query(query) {
    return "response" + query;
  }
}

// Cached DB obje
class CachedDatabase extends DatabaseBase {
  constructor() {
    super();
    this.cacheQuery = {};
  }
  query(query) {
    if(this.cacheQuery[query]) {
      return this.cacheQuery[query];
    }
    this.cacheQuery[query] = this.getDatabase().query("quer1");
    return this.cacheQuery[query];
  }
  // Lazy initiallization of heavy obejct
  getDatabase() {
    if(typeof this._database === 'object')
      return this._database;
    this._database = new Database();
    return this._database;
  }
}

/**
 * CachedDatabase is proxy object for original db
 * Lazy initialization 
 * Access control
 */
const db = new CachedDatabase();
console.log(db.query("query1"));