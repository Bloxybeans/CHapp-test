export default {
    async fetch(request, env, ctx) {
        if (request.headers.get("Upgrade") === "websocket") {
            const [client, server] = new WebSocketPair();
            server.accept();

            // Keep track of connected clients
            const clients = [];

            clients.push(server);

            server.addEventListener("message", event => {
                // Broadcast the message to all connected clients
                clients.forEach(client => client.send(event.data));
            });

            server.addEventListener("close", () => {
                // Remove client from the list when they disconnect
                const index = clients.indexOf(server);
                if (index !== -1) {
                    clients.splice(index, 1);
                }
            });

            return new Response(null, { status: 101, webSocket: client });
        }
        return new Response("WebSocket service", { status: 200 });
    }
};
