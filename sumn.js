const axios = require("axios");
const { checkSlowQueriesMySQL } = require("./checkSlowQueriesMySQL");
const { google } = require('googleapis');

async function getAccessToken() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'path/to/your/service-account-file.json', // Path to your service account key file
        scopes: ['https://www.googleapis.com/auth/chat.bot']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
}

async function monitorAPI() {
    console.log("Monitoring API...");

    try {
        const url =
            "https://thanos.internal.bankraya.co.id/api/v1/stackdriver_cloudsql_instance_database_cloudsql_googleapis_com_database_postgresql_insights_perquery_execution_time?query=(idelta(stackdriver_cloudsql_instance_database_cloudsql_googleapis_com_database_postgresql_insights_perquery_execution_time{project_id=~%22.-p-.%22}[5m])%20%3E=%2010000000)";

        const response = await axios.get(url);
        const results = response.data.data.result;

        if (results && results.length > 0) {
            // If slow queries are detected, run the checkSlowQueriesMySQL function
            const slowQueries = await checkSlowQueriesMySQL();
            await sendMessageToChat(slowQueries);
        } else {
            console.log("No slow queries detected.");
        }
    } catch (error) {
        console.error("Error monitoring API:", error);
    }
}

async function sendMessageToChat(message) {
    const chatMessage = {
        text: message,
    };

    try {
        const token = await getAccessToken(); // Get the bearer token

        const res = await axios.post(
            "https://chat.googleapis.com/v1/spaces/AAAAaJGX8I8/messages", // Replace with your space ID
            chatMessage,
            {
                headers: {
                    Authorization: Bearer ${token}, // Use the token here
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Message sent successfully:", res.data);
    } catch (error) {
        console.error("Error sending message to Google Chat:", error);
    }
}

module.exports = { monitorAPI };