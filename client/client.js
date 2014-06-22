Meteor.subscribe("markers");

var GATES3 = "gates3";
var GATES4 = "gates4";
var GATES5 = "gates5";
var GATES6 = "gates6";
var GATES7 = "gates7";
var GATES8 = "gates8";
var GATES9 = "gates9";
var FLOORS = [GATES9, GATES8, GATES7, GATES6, GATES5, GATES4, GATES3]

var mapContainerTemplate = '<div class="map-container" id="<%= floor %>">\n  <h2><%= index %></h2></div>';


var coordsRelativeToElement = function(elem, ev) {
  var offset = $(elem).offset();
  return {
    x: ev.pageX - offset.left, 
    y: ev.pageY - offset.top
  };
}

var getFloors = function() {
  return FLOORS;
}

var toggleView = function($container, targetNode) {
  if ($container.hasClass('detail-view')) {
    if (targetNode.id === 'footer') {
      glanceView($container, targetNode);
      return $container.toggleClass('detail-view');
    }
  } else {
    detailView($container, targetNode);
    return $container.toggleClass('detail-view');
  }
};

var detailView = function($container, targetNode) {
  var translateDistance;
  translateDistance = 0;
  _.forEach($('.map-container'), function(mapContainer, index) {
    var $mapContainer;
    $mapContainer = $(mapContainer);
    translateDistance += $mapContainer.height() / 4;
    return $mapContainer.transition({
      perspective: 500,
      rotateX: 0,
      width: '650px',
      height: '450px',
      top: '0px'
    });
  });
  $container.css('overflow-x', 'scroll').append('<div id="footer">Back to glance view</div>');
  window.location.hash = targetNode.id;
  return $container;
};

 
var glanceView = function($container) {
  $('#footer').remove();
  $container.scrollLeft(0);
  _.forEach($('.map-container'), function(mapContainer, index) {
    var $mapContainer;
    $mapContainer = $(mapContainer);
    return $mapContainer.transition({
      perspective: 500,
      rotateX: 60,
      width: '325px',
      height: '225px',
      top: "" + (-150 * index) + "px",
      'z-index': (10 - index)
    });
  });
  return $container.css('overflow-x', 'hidden');
};

var init = function($container) {
  console.log('initializing');
  $container.hammer().on('tap', function(ev) {
    return toggleView($container, ev.target);
  });
  FLOORS.forEach(function(floor, index) {
    console.log('logging:', floor);
    var $map;
    $map = $(_.template(mapContainerTemplate, {
      floor: floor,
      index: index + 3
    }));
    $container.append($map);
  });

  glanceView($container);
}

Template.map.created = function() {
  $('#map').hammer().on('tap', function(ev) {

    // console.log('hello, world');
    console.log(':: #map on tap :: about to create a marker based on the tap event');
    var point = coordsRelativeToElement('#map', ev.gesture.center);
    console.log(':: #map on tap :: random point: ' + JSON.stringify(point));

    Meteor.call('createMarker', {
      type: 'team',
      coordinates: point,
      info: {
        project: {
          name: 'Marauder'
        }
      }
    });
  });
}

Template.map.rendered = function() {
  var self = this;
  if (!self.handle) {
    init($("#container"));
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

Meteor.startup(function() {

});

