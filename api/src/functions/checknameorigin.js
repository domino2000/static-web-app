const { app } = require('@azure/functions');
const https = require('https');

app.http('checknameorigin', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Get name from query parameter
        const name = request.query.get('name') || await request.text() || 'world';
        
        // Call the nationalize.io API
        try {
            const result = await fetchNameOrigin(name);
            
            return {
                jsonBody: {
                    name: result.name,
                    count: result.count,
                    countries: result.country.map(c => ({
                        countryId: c.country_id,
                        probability: c.probability
                    }))
                }
            };
        } catch (error) {
            context.log.error(`Error fetching name origin: ${error.message}`);
            return {
                status: 500,
                jsonBody: { error: "Failed to fetch name origin data" }
            };
        }
    }
});

// Helper function to fetch data from nationalize.io API
function fetchNameOrigin(name) {
    return new Promise((resolve, reject) => {
        https.get(`https://api.nationalize.io/?name=${encodeURIComponent(name)}`, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (e) {
                    reject(new Error('Failed to parse API response'));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
