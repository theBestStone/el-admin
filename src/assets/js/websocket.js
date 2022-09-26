import bus from '../../components/common/bus';
import common from "./common.js";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

let websocket = {
    initWebSocket() {
        if (this.initialized) {
            return this;
        }
        this.connect();
        let self = this;
        this.initialized = true;
        return this;
    },
    connect() {
        let self = this;
        try {
            ///throw 'use poll';
            self.disconnect();

            let token = bus.$store.getters.getLogin("token");
            let encodedToken = encodeURIComponent(token);
            this.socket = new SockJS(common.ctx + '/messages?X-Token=' + encodedToken);
            this.stompClient = Stomp.over(this.socket);
            var headers = {};
            this.stompClient.connect(headers, (frame) => {
                this.stompClient.subscribe('/topic/*', (msg) => {
                    self.onMessage(msg);
                });
                this.stompClient.subscribe('/queue/*', (msg) => {
                    self.onMessage(msg);
                });
            }, (err) => {
                console.log(err);
                console.log('Seems lost connection, reconnecting...');
                setTimeout(() => {
                    self.disconnect();
                    self.connect();
                }, 10 * 1000)
            });
        } catch (e) {
            console.log(e);
            console.log('websocket不可用，将使用轮训');
            setInterval(() => {
                let msg = {
                    newNotice: true,
                    newTask: true
                };
                self.onMessage({
                    body: JSON.stringify(msg)
                });
            }, 10 * 1000);
        }
    },
    disconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
    },
    onMessage(message) {
        let self = this;
        if (self.messageHandlers) {
            for (let messageHandler of self.messageHandlers) {
                try {
                    let payload = eval('(' + message.body + ')');
                    messageHandler.call(self, payload);
                } catch (e) {
                    console.log("Ignore this,Just debug flag,It is not json body:" + message.body);
                    //                    console.log(e); 
                }
            }
        }
    },
    addMessageListner(messageHandler) {
        let self = this;
        if (!self.messageHandlers) {
            self.messageHandlers = [];
        }
        if (typeof messageHandler == "function") {
            self.messageHandlers.push(messageHandler);
        }
    }
}
export default websocket;
