function Graph() {
    this.verticies = {};
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
bkGraph.addVertex(2, [1, 3, 5]);
bkGraph.addVertex(3, [2, 4]);
bkGraph.addVertex(4, [3, 5, 6]);
bkGraph.addVertex(5, [1, 2, 4]);
bkGraph.addVertex(6, [4]);


var bronKerbosch = function(clique, verticies, processedVerticies) {
    console.log(clique, verticies, processedVerticies);
    debugger
    if (verticies.isEmpty() && processedVerticies.isEmpty())
        console.log("CLIQUE", clique);
    else {
        var pivotVertex = choosePivotVertex(verticies);
        for (var i = 0; i < verticies.length; i++) {
            var vertex = verticies[i];
            if (!vertex.isConnected(pivotVertex)) {
                debugger
                var newClique = clique.union([vertex]);
                var newVerticies = verticies.intersect(bkGraph.getNeighbors(vertex));
                var newProcessed = processedVerticies.intersect(bkGraph.getNeighbors(vertex));
                bronKerbosch(newClique, newVerticies, newProcessed);
                verticies.push(vertex);
                processedVerticies.push(vertex);
            }
        }
    }
};

var choosePivotVertex = function(verticies) {
    return verticies.max(function(v) {
        return v.getNumberOfConnections();
    });
};

bronKerbosch([], bkGraph.getVerticies(), []);
