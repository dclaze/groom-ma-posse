var Seq = require('seq'),
    Datastore = require('nedb'),
    GetFriendsPollingInterval = 60 * 1000 + (10 * 1000 * Math.random()), //Twitter Rate Limit (15 Req / 15 Mins) plus some random extra time
    uuid = require('uuid-v4');

function TwitterMiner(twitter, userId) {
    this.twitter = twitter;
    this.db = new Datastore({
        filename: __dirname + '/twitter_data/' + ((typeof(userId) === "undefined") ? uuid() : userId )+ '.db',
        autoload: true
    });
}

TwitterMiner.prototype.getFriends = function(id, getFriendsOfFriends, callback) {
    var self = this;
    var sequence = Seq()
        .seq(function() {
            var next = this;
            self.twitter.get('/friends/ids.json?user_id=' + id, function(data) {
                var ids = data.ids;
                self.storeFriendNode(id, ids, function() {
                    next(null, ids);
                });
            });
        });
    if (getFriendsOfFriends) {
        sequence.flatten()
            .seqEach(function(nextId) {
                var next = this;
                setTimeout(function() {
                    self.getFriends(nextId, false, next);
                }, GetFriendsPollingInterval);
            });
    }
    sequence.seq(function() {
        this(null);
        self.db.find({}, function(err, docs) {
            if (err)
                console.error(err);
            callback(docs);
        });
    });
};

TwitterMiner.prototype.storeFriendNode = function(id, connections, callback) {
    console.log(id, connections);
    var self = this;
    self.db.findOne({
        id: id
    }, function(err, doc) {
        if (doc) {
            var commonConnections = doc.connections.intersect(connections)
            var newIds = connections.subtract(commonConnections);
            self.db.update({
                id: doc.id
            }, {
                $push: {
                    connections: {
                        $each: newIds
                    }
                }
            }, {}, function(err, docs) {
                if (err)
                    console.error(err);
                callback(docs);
            });

        } else {
            self.db.insert({
                id: id,
                connections: connections
            }, function(err, docs) {
                if (err)
                    console.error(err);
                callback(docs);
            })
        }
    });
};

module.exports = TwitterMiner;
