// Marauder's Map: Hackathon Remix
//
// This file contains all code which will only be given to the server
// (the client will never see this code)

Meteor.publish("markers", function() {
  return Markers.find({}, {});
});
