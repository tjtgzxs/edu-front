const socket = new WebSocket(localStorage.getItem('ws_url')+'api/websocket');

socket.onopen = (event) => {
    console.log('WebSocket connection opened:', event);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle incoming WebSocket data (chat messages)
};

socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
};
