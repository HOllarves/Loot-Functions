module.exports = {
  nameRegex: /Steam CD Key|Steam Gift|Steam Altergift|Steam|GOG CD Key|GOG|Altergift|Uplay CD Key|Uplay|Origin CD Key|Origin|Epic Games CD Key|Epic Games|XBOX ONE CDKey|Xbox One CD Key|XBOX ONE|Xbox One|PS4 CD Key|PS4|ps4|EU|US|EMEA|Season Pass|CD Key|Digital Download|Digital|Download|Rockstar|Bethesda|Pre-Order|Pre Order|Windows 10|Windows|10|DLC|CD/gi,
  regions: ['EU', 'US', 'EMEA'],
  platforms: ['PC', 'Xbox One', 'Nintendo Switch', 'PS4'],
  methods: ['Steam Gift', 'Steam Altergift', 'CD Key'],
  types: ['DLC', 'Season Pass', 'Full', 'Pre-Order'],
  slugify: (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }
}