
module.exports = io => {
  io.on('connection', socket => {
    socket.on('join', data => {
      socket.join(data.username)
    });

    function broadcast(username, msg) {
      io.sockets.in(username).emit('incoming_request', msg)
    }

    socket.on('Compete Request', data => {
      broadcast(data.user2, {
        msg: `You've received a compete request from ${data.user1}`
      });
    }
  });
}