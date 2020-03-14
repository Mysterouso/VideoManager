const { Pool } = require('pg')

const connectionString = process.env.POSTGRES_CONNECTION_STRING
const pool = new Pool({
  connectionString: connectionString,
})

module.exports = (parameters,query) => {
  return pool.query(query,parameters)
  .then(res=>res.rows)
  .catch(err=>console.log("Error",err))
}