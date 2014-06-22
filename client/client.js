Meteor.subscribe("markers");

Template.map.rendered = function() {
  var self = this;
  if (!self.handle) {
    self.handle = Deps.autorun(function() {
      console.log(':: Template.map.rendered :: re-rendering the map');
      $('#map').children('.marker').remove();

      var markers = Markers.find().fetch();
      console.log(markers);
      markers.forEach(function(marker, idx, arr) {
        $marker = $('<div class="marker"></div>').css({
          top: marker.coordinates.y,
          left: marker.coordinates.x
        });
        $('#map').append($marker)});
    });
  }
}

Template.map.events({
  'click #add-button': function(ev, template) {
    console.log(':: click #add-button :: creating and and inserting a random marker ');
    var point = {
      x: Math.round(Math.random() * 801),
      y: Math.round(Math.random() * 467)
    }
    console.log(':: click #add-button :: random point: ' + JSON.stringify(point));

    Meteor.call('createMarker', {
      type: 'team',
      coordinates: {
        x: Math.round(Math.random() * 801),
        y: Math.round(Math.random() * 467)
      },
      info: {
        project: {
          name: 'Marauder'
        }
      }});
  },
});

$(document).ready(function () {
  $('#map').hammer().on('tap', function(ev) {

    // console.log('hello, world');
    console.log(':: #map on tap :: about to create a marker based on the tap event');
    var point = {
      x: ev.gesture.center.pageX,
      y: ev.gesture.center.pageY
    }
    console.log(':: #map on tap :: random point: ' + JSON.stringify(point));

    Meteor.call('createMarker', {
      type: 'team',
      coordinates: {
        x: ev.gesture.center.pageX,
      y: ev.gesture.center.pageY
      },
      info: {
        project: {
          name: 'Marauder'
        }
      }
    });
  });
});

