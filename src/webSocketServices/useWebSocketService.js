import useWebSocket from 'react-use-websocket';

const useWebSocketService = (socketUrl) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Automatically reconnect on close
    reconnectAttempts: Infinity, // Keep trying to reconnect indefinitely
    reconnectInterval: 5000, // Reconnect every 5 seconds
  });

  return { sendJsonMessage, readyState, lastJsonMessage };
};

export default useWebSocketService;