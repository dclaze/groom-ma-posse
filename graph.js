if (typeof exports !== 'undefined')
    var Vertex = require('./vertex');

function Graph() {
    this.verticies = {};
    this.edges = {};
};

Graph.prototype.addVertex = function(id, connections) {
    this.verticies[id] = new Vertex(id, connections);
};

Graph.prototype.getNeighbors = function(vertex) {
    var graph = this;
    return vertex.getConnections().map(function(connectionId) {
        return graph.verticies[connectionId];
    });
};

Graph.prototype.getVerticies = function() {
    var graph = this;
    return Object.keys(this.verticies).map(function(vertex) {
        return graph.verticies[vertex];
    });
};

if (typeof exports !== 'undefined')
    module.exports = Graph;
