/**
 * Creates a DB session, executes query and closes session
 * @param {*} query
 * @returns {*}
 */
const DBQuery = async query => {
  const { connectDB, closeDB } = require("./config")
  try {
    await connectDB()
  } catch (err) {
    throw new Error("Unable to connect DB")
  }

  try {
    const result = await query
    await closeDB()
    return result
  } catch (err) {
    await closeDB()
    console.log(err)
    throw new Error("Error executing DB operation")
  }
}

module.exports = DBQuery