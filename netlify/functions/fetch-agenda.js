const fetch = require('node-fetch');

exports.handler = async function () {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1fcTrcBVpO7xIfpzuX65_lzsMeD1SHmKPZAKzidOnLcw/export?format=csv&gid=644213694';

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch CSV: ${response.statusText}`,
      };
    }

    const csvText = await response.text();
    // Here you can process the CSV and convert it to HTML if needed
    return {
      statusCode: 200,
      body: csvText,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching agenda: ${error.message}`,
    };
  }
};
