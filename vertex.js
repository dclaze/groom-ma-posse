function Vertex(id, connections) {
    this.id = id;
    this.connections = connections;
};
Vertex.prototype.getConnections = function() {
    return this.connections;
};
Vertex.prototype.getNumberOfConnections = function() {
    return this.connections.length;
};
Vertex.prototype.isConnected = function(vertex) {
    return this.connections.indexOf(vertex.id) != -1;
};

if (typeof exports !== 'undefined')
    module.exports = Vertex;
