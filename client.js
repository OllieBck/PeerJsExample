/* Socket Server - Socket.io here */
var socket = io.connect();

socket.on('connect', function() {
	console.log("Connected");
});

// Receive other folks peer ids
socket.on('peer_id', function (data) {
	console.log("Got a new peer: " + data);
  var call = peer.call(data, my_stream);

	call.on('stream', function(remoteStream) {
		console.log("Got remote stream");
		var ovideoElement = document.createElement('video');
		ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
		ovideoElement.setAttribute("autoplay", "true");
		ovideoElement.play();
	});

});

socket.on('group', function(data){
		var numToCall = data;
		var call = peer.call(numToCall, my_stream);

		call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
					// And attach it to a video object
					//var ovideoElement = document.getElementById('othervideo');
					var ovideoElement = document.createElement("video");
					ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
					ovideoElement.setAttribute("autoplay", "true");
					ovideoElement.play();
					document.body.appendChild(ovideoElement);
				});
});

var my_stream = null;
var peer = null;
var peer_id = null;

//init(){
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
	navigator.getUserMedia({video: true, audio: true}, function(stream) {
			my_stream = stream;
			var videoElement = document.getElementById('myvideo');
			videoElement.src = window.URL.createObjectURL(stream) || stream;
			videoElement.play();

			// Register for an API Key:	http://peerjs.com/peerserver
			//var peer = new Peer({key: 'YOUR API KEY'});
			// The Peer Cloud Server doesn't seem to be operational, I setup a server on a Digital Ocean instance for our use, you can use that with the following constructor:
			// can setup a user name
			peer = new Peer({host: 'liveweb.itp.io', port: 9000, path: '/'});

			peer.on('error', function(err){
				console.log(err);
			});

			// Get an ID from the PeerJS server
			peer.on('open', function(id) {
			  console.log('My peer ID is: ' + id);
			  peer_id = id;
				socket.emit('peer_id', peer_id);
			});

			peer.on('call', function(incoming_call) {
				console.log("Got a call!");
				incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
				incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
					// And attach it to a video object
					var ovideoElement = document.createElement("video");
					ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
					ovideoElement.setAttribute("autoplay", "true");
					ovideoElement.play();
					document.body.appendChild(ovideoElement);

				});
			});


		}, function(err) {
			console.log('Failed to get local stream' ,err);
	});
}
