const database = require("../config/database")();

class Orm {

    query(query, values = []) {
        values.map(val => {
            return database.escape(val);
        })
        return new Promise((resolve, reject) => {
            database.query(`${query}`, values, (err, rows) => {
                if (err) {
                    reject({ error: err });
                } else {
                    resolve({ result: rows });
                }

            })
        })
    }
}

module.exports = Orm;