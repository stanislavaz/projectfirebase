
    ```javascript
    const { handler } = require('@netlify/functions');
    const { join } = require('path');
    const { readFileSync, writeFileSync } = require('fs');

    // Load the database (in this case, a JSON file)
    let posts = [];
    let usernames = {};
    let userIDs = {};
    try {
      const data = JSON.parse(readFileSync(join(__dirname, '../posts.json')));
      posts = data.posts || [];
      usernames = data.usernames || {};
      userIDs = data.userIDs || {};
    } catch (error) {
      console.error('Error reading initial database file:', error);
    }

    // Function to get posts
    exports.handler = handler(async (event) => {
      if (event.httpMethod === 'GET') {
        return {
          statusCode: 200,
          body: JSON.stringify({ posts }),
        };
      } else if (event.httpMethod === 'PUT') {
        try {
          posts = JSON.parse(event.body).posts || [];
          await saveDatabase(); // Update the database
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Posts updated successfully.' }),
          };
        } catch (error) {
          console.error('Error updating posts:', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update posts.' }),
          };
        }
      }
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    });

    // Function to get user data
    exports.handler = handler(async (event) => {
      if (event.httpMethod === 'GET') {
        return {
          statusCode: 200,
          body: JSON.stringify({ usernames, userIDs }),
        };
      } else if (event.httpMethod === 'PUT') {
        try {
          const { usernames, userIDs } = JSON.parse(event.body);
          usernames = usernames || {};
          userIDs = userIDs || {};
          await saveDatabase(); // Update the database
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data updated successfully.' }),
          };
        } catch (error) {
          console.error('Error updating user data:', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update user data.' }),
          };
        }
      }
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
      };
    });

    // Function to save the database to a JSON file
    async function saveDatabase() {
      try {
        writeFileSync(
          join(__dirname, '../posts.json'),
          JSON.stringify({ posts, usernames, userIDs }),
          'utf8'
        );
      } catch (error) {
        console.error('Error saving database:', error);
      }
    }
    ```
