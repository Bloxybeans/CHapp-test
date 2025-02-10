export default {
    async fetch(request, env, ctx) {
        if (request.headers.get("Upgrade") === "websocket") {
            const [client, server] = new WebSocketPair();
            server.accept();

            server.addEventListener("message", event => {
                server.send(event.data);
            });

            return new Response(null, { status: 101, webSocket: client });
        }
        return new Response("WebSocket service", { status: 200 });
    }
};
