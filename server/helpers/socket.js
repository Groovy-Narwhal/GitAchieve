
module.exports = io => {
  io.on('connection', socket => {
    socket.on('join', data => {
      socket.join(data.username)
    });

    function broadcast(username, msg) {
      console.log('username in broadcast', username)
      io.sockets.in(username).emit('incoming_request', msg)
    }

    socket.on('Accept Request', data => {
      console.log('In Accept Request', data)
      broadcast(data.user1, {
        msg: `You've accepted a compete request from ${data.user2}`
      });
      broadcast(data.user2, {
        msg: `${data.user1} accepted you're compete request`
      });
    });

    socket.on('Compete Request', data => {
      console.log('In Compete Request', data)
      broadcast(data.user2, {
        msg: `You've received a compete request from ${data.user1}`
      });
      broadcast(data.user1, {
        msg: `You've sent a compete request to ${data.user2}`
      });
    });


  });
};