const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const store = getStore({
    name: 'votes',
    siteID: context.site.id,
  });

  if (event.httpMethod === 'GET') {
    try {
      const votes = await store.get('vote-count') || '0';
      return {
        statusCode: 200,
        body: JSON.stringify({ votes: parseInt(votes, 10) })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching votes', error: error.message })
      };
    }
  }

  // Handle POST (voting)
  try {
    const currentVotes = parseInt(await store.get('vote-count') || '0', 10);
    const newVotes = currentVotes + 1;
    await store.set('vote-count', newVotes.toString());
    
    return {
      statusCode: 200,
      body: JSON.stringify({ votes: newVotes })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating votes', error: error.message })
    };
  }
};
