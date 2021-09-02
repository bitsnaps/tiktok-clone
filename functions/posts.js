const { createClient } = require("@astrajs/collections")

const collection = 'posts'

//checkout the doc for more: https://docs.datastax.com/en/astra/docs/astra-collection-client.html
exports.handler = async function (event, context, callback) {
  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
  })

  // The namespace is the KEYSPACE
  const posts = astraClient
    .namespace(process.env.ASTRA_DB_KEYSPACE)
    .collection(collection)

    try {
      // create a user subdocument
      const res = await posts.find({})
      return {
        statusCode: 200,
        body: JSON.stringify(res)
      }
    } catch (e) {
      console.error(e)
      return {
        statusCode: 500,
        body: JSON.stringify(e)
      }
    } finally {

    }

}
