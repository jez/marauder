Meteor.subscribe("markers");

var GATES3 = "gates3";
var GATES4 = "gates4";
var GATES5 = "gates5";
var GATES6 = "gates6";
var GATES7 = "gates7";
var GATES8 = "gates8";
var GATES9 = "gates9";
var FLOORS = [GATES9, GATES8, GATES7, GATES6, GATES5, GATES4, GATES3]

var mapContainerTemplate = '<div class="map-container" id="<%= floor %>">\n</div>';


var coordsRelativeToElement = function(elem, ev) {
  var offset = $(elem).offset();
  console.log('offset: ' + JSON.stringify(offset));
  console.log('ev: ' + JSON.stringify(ev));
  console.log('scrollTop: ' + $('body').scrollTop());
  return {
    x: ev.pageX - offset.left,
    y: ev.pageY - (offset.top - $('body').scrollTop()),
    z: parseInt($(elem).attr('id').slice(5), 10)
  };
}

var getFloors = function() {
  return FLOORS;
}

var toggleView = function($container, targetNode) {
  if ($container.hasClass('detail-view')) {
    if (targetNode.id === 'footer') {
      $container.toggleClass('detail-view');
      glanceView($container, targetNode);
    }
  } else {
    $container.toggleClass('detail-view');
    detailView($container, targetNode);
  }
};

var detailView = function($container, targetNode) {
  var translateDistance;
  translateDistance = 0;
  $container.removeClass("is-rotated");
  $container.css('overflow-x', 'scroll').append('<div id="footer">Back to glance view</div>');
  window.location.hash = targetNode.id;
  $container.scrollLeft($container.width() / 4);
  return $container;
};


var glanceView = function($container) {
  $('#footer').remove();
  $container.scrollLeft(0);
  $container.addClass("is-rotated")
  _.forEach($('.map-container'), function(mapContainer, index) {
    var $mapContainer;
    $mapContainer = $(mapContainer);
    console.log($mapContainer.style)
    /*return $mapContainer.css({
      'z-index': (10 + index)
    });*/
  });
  return $container.css('overflow-x', 'hidden');
};

var init = function($container) {
  $container.hammer().on('tap', function(ev) {
    return toggleView($container, ev.target);
  });
  FLOORS.forEach(function(floor, index) {
    var $map;
    $map = $(_.template(mapContainerTemplate, {
      floor: floor,
    }));
    $container.append($map);
  });

  glanceView($container);
}

Template.map.rendered = function() {
  var self = this;
  if (!self.handle) {
    init($("#container"));
    $('.map-container').hammer().on('tap', function(ev) {
      if($('#container').hasClass('detail-view')) {
        console.log(':: #map on tap :: about to create a marker based on the tap event');

        var point = coordsRelativeToElement(ev.target, ev.gesture.center);
        console.log(':: #map on tap :: random point: ' + JSON.stringify(point));

        Meteor.call('createMarker', {
          type: 'team',
          coordinates: point,
          info: {
            project: Session.get('project')
          }
        });
      }
    });
    self.handle = Deps.autorun(function() {
      if(Session.get('project') == null) {
        $('#marker-form').css('display', 'block');
      }


      console.log(':: Template.map.rendered :: re-rendering the map');

      $('.map-container').each(function(idx, elem) {
        $(this).children('.marker').remove();
      });

      var markers = Markers.find().fetch();
      markers.forEach(function(marker, idx, arr) {
        $marker = $('<div class="marker"></div>').css({
          top: marker.coordinates.y,
          left: marker.coordinates.x
        });
        $('#gates' + marker.coordinates.z).append($marker)});
    });
  }
}

Template.map.events({
  'click #submit': function(ev, template) {
    var project = {};
    project.name = $('#project-name-input').val();
    project.description = $('#project-description-input').val();

    Session.set('project', project);
    $('#marker-form').css('display', 'none');
  }
});
