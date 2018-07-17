const child_process = require('child_process');

class NetworkTest {
	constructor() {
		this.nodes = new Map();
		this.cpSet = new Set();
	}
	fork({count = 1}) {
		for (let i = 0; i < count; i++) {
			const cp = child_process.fork('qts-network.js');
			this.cpSet.add(cp);
			cp.on('close', this.on_close.bind(this, cp));
			cp.on('error', this.on_error.bind(this, cp));
			cp.on('disconnect', this.on_disconnect.bind(this, cp));
			cp.on('exit', this.on_exit.bind(this, cp));
			cp.on('message', this.on_message.bind(this, cp));
			cp.send({event: 'listNodes', nodes: Array.from(this.nodes.values())});
		}
	}
	on_close(cp, code, signal) {

	}
	on_error(cp, err) {

	}
	on_disconnect(cp) {

	}
	on_exit(cp, code, signal) {

	}
	sendNodes() {
		this.cpSet.forEach((v)=> {
			v.send({event: 'listNodes', nodes: Array.from(this.nodes.values())});
		});
	}
	on_message(cp, message, sendHandle) {
		this.nodes.set(cp.pid, message.address);
		this.sendNodes();
	}
};

const nc = new NetworkTest();
nc.fork({count: 10});
