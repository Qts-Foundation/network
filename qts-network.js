const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('close', () => {
  console.log(`server close:\n`);
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`${msg} from ${rinfo.address}:${rinfo.port} to ${server.address().address}:${server.address().port}`);
});

server.on('listening', () => {
  const address = server.address();
	process.send({event: 'listening', address})
});

process.on('message', (msg)=> {
	if(msg.event === 'listNodes') {
		msg.nodes.forEach(element => {
			server.send('test', element.port, element.address);
		});
	}
});

server.bind(0, 'localhost');