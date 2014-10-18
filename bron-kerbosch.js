require('sugar');
var streamline = require('streamline');
var neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase('http://localhost:7474');

// db.createNode({id:"letmein123"})
// 	.save(function(err, node){
// 		if(err)
// 			console.log(err)
// 		console.log(node)
// 	})



function Graph() {
    this.verticies = {};
};

Graph.prototype.addVertex = function(id, connections) {
    this.verticies[id] = new Vertex(id, connections);
};

Graph.prototype.getNeighbors = function(vertex) {
    var graph = this;
    return vertex.getConnections().map(function(connectionId) {
        return graph[connectionId];
    });
};

Graph.prototype.getVerticies = function() {
    var graph = this;
    return Object.keys(this.verticies).map(function(vertex) {
        return graph.verticies[vertex];
    })
};

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

var bkGraph = new Graph();
bkGraph.addVertex(1, [2, 5]);
bkGraph.addVertex(2, [1, 2, 5]);
bkGraph.addVertex(3, [2, 4]);
bkGraph.addVertex(4, [3, 5, 6]);
bkGraph.addVertex(5, [1, 2, 4]);
bkGraph.addVertex(6, [4]);


var bronKerbosch = function(clique, verticies, processedVerticies) {
    console.log(clique, verticies, processedVerticies);
    if (verticies.isEmpty() && processedVerticies.isEmpty())
        return clique;
    debugger
    var pivotVertex = choosePivotVertex(verticies.union(processedVerticies));
    for (var vertex in verticies) {
        if (!vertex.isConnected(pivotVertex)) {
            bronKerbosch(clique.union([vertex]),
                verticies.intersect(bkGraph.getNeighbors(vertex)),
                processedVerticies.intersect(bkGraph.getNeighbors(vertex)));
            verticies.push(v);
            processedVerticies.push(v);
        }
    }
};

var choosePivotVertex = function(verticies) {
    return verticies.max(function(v) {
        return v.getNumberOfConnections();
    });
};

bronKerbosch([], bkGraph.getVerticies(), []);
