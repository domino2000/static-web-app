const { app } = require('@azure/functions');

app.http('message', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request.');
        
        // Return a proper JSON response
        return {
            status: 200,
            jsonBody: { text: "Witaj! Funkcja działa." }
        };
    }
});