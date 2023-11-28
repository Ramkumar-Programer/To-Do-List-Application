

async function executeQuery(db, query, params = []) {
  //console.log(query + "  " + params)
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


module.exports = {
    executeQuery
}