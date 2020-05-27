/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
module.exports = {
  nameRegex: /Steam CD Key|Steam Gift|Steam Altergift|Steam|GOG CD Key|GOG|Altergift|Uplay CD Key|Uplay|Origin CD Key|Origin|Epic Games CD Key|Epic Games|XBOX ONE CDKey|Xbox One CD Key|XBOX ONE|Xbox One|PS4 CD Key|PS4|ps4|Nintendo Switch|Nintendo|EU|US|EMEA|Season Pass|CD Key|Digital Download|Digital|Download|Rockstar|Bethesda|Pre-Order|Pre Order|Windows 10|Windows10|Windows|10|DLC|CD/gi,
  regions: ['EU', 'US', 'EMEA'],
  platforms: ['PC', 'Xbox One', 'Nintendo Switch', 'PS4'],
  methods: ['Steam Gift', 'Steam Altergift', 'CD Key'],
  types: ['DLC', 'Season Pass', 'Full', 'Pre-Order'],
  slugify: (text) => (
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  ),
  bulkSert: (records, Model, match) => {
    match = match || ['_id']
    return new Promise((resolve, reject) => {
      const bulk = Model.collection.initializeUnorderedBulkOp()
      records.forEach((record) => {
        const query = {}
        match.forEach((m) => { query[m] = record[m] })
        bulk.find(query).upsert().updateOne(record)
      })
      bulk.execute((err, bulkres) => {
        if (err) return reject(err)
        resolve(bulkres)
      })
    })
  },
}
