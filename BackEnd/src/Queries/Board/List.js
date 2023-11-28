

const selectListNameQuery = (tableName) =>
`
    SELECT listName FROM ${tableName} where userId = ? AND listName = ?;
`

const insertListNameQuery = (tableName) => 
`
    INSERT INTO ${tableName} (listName, userId) VALUES (?,?);
`

module.exports = {
    selectListNameQuery,
    insertListNameQuery
}