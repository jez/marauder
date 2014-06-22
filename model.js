// Marauder's Map: Hackathon Remix
//
// All the data models
// Loaded on both the client and the server

Markers = new Meteor.Collection("markers");

var TEAM = "team";
var validTypes = [TEAM];

// Access control modifiers
Markers.allow({
  insert: function(userId, marker) {
    return false; // no "cowboy" inserts -> use createMarker method for validation
  },
  update: function(userId, marker) {
    return true;
  },
  remove: function(userId, marker) {
    return true;
  }
});

// Defining patterns to check for valid arguments
var Types = Match.Where(function (type) {
  check(type, String);
  return validTypes.indexOf(type) != -1;
});

var CoordinatePair = Match.ObjectIncluding({
  x: Number,
  y: Number
});

var Project = Match.ObjectIncluding({
  name: String
});

Meteor.methods({
  createMarker: function(params) {
    console.log(':: createMarker :: checking params');

    check(params, {
      type: Match.OneOf(Types),
      coordinates: CoordinatePair,
      info: Object
    });

    console.log(':: createMarker :: checking info params');

    // Validate the params.info object based on type
    switch(params.type) {
      case TEAM:
        check(params.info, {
          project: Project,
        });
        break;
    }

    console.log(':: createMarker :: params checking succeeded');
    console.log(':: createMarker :: inserting into Markers collection');
    var id = params._id || Random.id()
    Markers.insert({
      _id: id,
      type: params.type,
      coordinates: params.coordinates,
      info: params.info
    });

    console.log(':: createMarker :: id of inserted marker: ' + id);
    return id;
  }, // end createMarker
    removeAllMakers: function() {
      console.log(':: removeAllMarkers :: calling Markers.remove({})');
      return Markers.remove({});
    }
});
