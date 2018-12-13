import WebsocketHeartbeatJs from '../utils/heartbeat';

let ws;
const url =
  'ws://192.168.10.8/acloud_new/websocket/message?socketKey=123&companyId=DccBRhlrSiu9gMV7fmvizw';

const options = {
  url,
  pingTimeout: 15000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

export function connect() {
  console.log('options', options);

  ws = new WebsocketHeartbeatJs(options);
  ws.onopen = function() {
    console.log('connect success');
    ws.send('hello server');
  };
  ws.onmessage = function(e) {
    console.log(`onmessage: ${e.data}`);
  };
  ws.onreconnect = function() {
    console.log('reconnecting...');
  };
}
