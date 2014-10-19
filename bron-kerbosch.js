if (typeof exports !== 'undefined') {
    var Graph = require('./graph');
    require('sugar');
    var fs = require('fs');
}

var uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function CliqueDetection(graph) {
    this.graph = graph;
}

CliqueDetection.prototype.bronKerbosch2 = function(clique, verticies, processedVerticies) {
    var cliques = [];
    if (verticies.isEmpty() && processedVerticies.isEmpty())
        cliques.push(clique);
    else {
        var pivotVertex = this.choosePivotVertex(verticies.union(processedVerticies));
        var nonNeighborVerticies = verticies.subtract(this.graph.getNeighbors(pivotVertex));
        for (var i = 0; i < nonNeighborVerticies.length; i++) {
            var vertex = nonNeighborVerticies[i];
            cliques.add(this.bronKerbosch2(clique.union([vertex]), verticies.intersect(this.graph.getNeighbors(vertex)), processedVerticies.intersect(this.graph.getNeighbors(vertex))));
            verticies = verticies.subtract(vertex);
            processedVerticies.push(vertex);
        }
    }

    return cliques;
};

CliqueDetection.prototype.choosePivotVertex = function(verticies) {
    return verticies.max(function(v) {
        return v.getNumberOfConnections();
    });
};

CliqueDetection.prototype.bronKerbosch3 = function() {
    var cliques = [];
    var clique = [],
        verticies = this.graph.getVerticies();
    processedVerticies = [];
    var orderedVerticies = this.graph.getVerticies().sortBy(this.vertexDegeneracy);
    for (var i = 0; i < orderedVerticies.length; i++) {
        var vertex = orderedVerticies[i];
        cliques.add(this.bronKerbosch2(clique.union(vertex), verticies.intersect(this.graph.getNeighbors(vertex)), processedVerticies.intersect(this.graph.getNeighbors(vertex))));
        verticies = verticies.subtract(vertex);
        processedVerticies.push(vertex);
    }
    return cliques;
};

CliqueDetection.prototype.vertexDegeneracy = function(vertex) {
    return vertex.getNumberOfConnections();
};

function Clique(vertexes) {
    this.id = uuid();
    this.vertexes = vertexes;
};
Clique.prototype.intersection = function(clique) {
    return this.vertexes.intersect(clique.vertexes);
};

function Community(clique) {
    this.cliques = [];
    this.id = uuid();
    if (clique)
        this.cliques.push(clique);
};
Community.prototype.add = function(clique) {
    this.cliques.push(clique);
};

// NJIT = JSON.parse(fs.readFileSync(__dirname + '/twitter_njit.json'));
NJIT = NJIT.filter(function(item) {
    return !(!item.connections || item.connections.length == 0);
});
var NJITGraph = new Graph();
for (var i = 0; i < NJIT.length; i++) {
    NJITGraph.addVertex(NJIT[i].id, NJIT[i].connections);
};
var cliqueDetector = new CliqueDetection(NJITGraph);
var NJITCliques = cliqueDetector.bronKerbosch3();

var cliques = NJITCliques.map(function(clique) {
    return new Clique(clique);
});

var cliqueToNode = {};
for (var i = 0; i < cliques.length; i++) {
    var clique = cliques[i];
    cliqueToNode[clique.id] = [].concat(clique.vertexes);
}

var nodeToClique = {};
for (var i = 0; i < cliques.length; i++) {
    var clique = cliques[i];
    for (var j = 0; j < clique.vertexes.length; j++) {
        var vertex = clique.vertexes[j];
        if (!nodeToClique.hasOwnProperty(vertex.id))
            nodeToClique[vertex.id] = [clique];
        else
            nodeToClique[vertex.id].push(clique);
    }
}

var getCommunities = function(cliques, k) {
    var communnities = [];
    var cliquesToCheck = [].concat(cliques);
    while (cliquesToCheck.length) {
        var clique = cliquesToCheck.shift(),
            community = new Community();
        community.add(clique);

        var neighboringCliques = getNeighboringCliques(clique, nodeToClique);
        for (var j = 0; j < neighboringCliques.length; j++) {
            var neighbor = neighboringCliques[j];
            if (neighbor.intersection(clique).length >= (k - 1)) {
                community.add(neighbor);
                cliquesToCheck.remove(neighbor);
                for (var k = 0; k < neighbor.vertexes; k++) {
                    var vertex = neighbor.vertexes[k];
                    nodeToClique[vertex.id].remove(neighbor);
                }
            }
        }
        communnities.push(community);
    }
    return communnities;
};


var getNeighboringCliques = function(clique, nodeToCliqueDictionary) {
    var neighboringCliques = [];
    for (var i = 0; i < clique.vertexes.length; i++) {
        var vertex = clique.vertexes[i];
        neighboringCliques.add(nodeToCliqueDictionary[vertex.id]);
    }

    return neighboringCliques;
};


COMMUNITIES = getCommunities(cliques, 3);

NODES = [];
COMMUNITIES.each(function(community) {
    community.cliques.each(function(clique) {
        clique.vertexes.each(function(vertex) {
            var node = NODES.find(function(n) {
                return n.name == vertex.id;
            });
            if (node && node != vertex)
                return
            NODES.push({
                name: vertex.id,
                connections: vertex.connections,
                group: community.id
            });
        })
    });
});
var CommunityIds = COMMUNITIES.map(function(c){
    return c.id;
});


LINKS = [];
NJIT.each(function(item) {
    item.connections.each(function(connection) {
        LINKS.push({
            source: item.id,
            target: connection,
            value: 1
        })
    })
})
