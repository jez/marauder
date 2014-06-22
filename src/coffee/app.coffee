mapContainerTemplate =
'''
<div class="map-container bg-<%= color %>" id="map-<%= index %>">
  <h2 style="font-size: 72px; text-align: center"><%= index %></h2>
  Pork belly hella stumptown vinyl, kitsch trust fund drinking vinegar. Post-ironic asymmetrical pork belly, High Life pickled DIY Cosby sweater tofu ethnic actually bitters. Tonx biodiesel squid normcore stumptown. Normcore Kickstarter selfies gentrify church-key. Farm-to-table Williamsburg meh keytar. Hoodie post-ironic +1 synth. Banh mi before they sold out Williamsburg aesthetic fanny pack ethical squid.
</div>
'''

popupTemplate =
'''
<div class="popup bg-<%= color %>">
  <%= popupContent %>
</div>
'''

toggleView = ($container, targetNode) ->
  if $container.hasClass 'detail-view'
    if targetNode.id == 'map-footer'
      glanceView $container, targetNode
      $container.toggleClass 'detail-view'
  else
    detailView $container, targetNode
    $container.toggleClass 'detail-view'

detailView = ($container, targetNode) ->
  translateDistance = 0;
  _.forEach $('.map-container'), (mapContainer, index) ->
    $mapContainer = $ mapContainer
    translateDistance += $mapContainer.height() / 4
    $mapContainer.transition
      perspective: 500
      rotateX: 0
      width: '200%'
      height: '200%'
  $container.css 'overflow-x', 'scroll'
            .append '<div id="map-footer" class="bg-white">Back to glance view</div>'
  window.location.hash = targetNode.id
  return $container

glanceView = ($container) ->
  $('#map-footer').remove()
  $container.scrollLeft 0
  _.forEach $('.map-container'), (mapContainer) ->
    $mapContainer = $ mapContainer
    $mapContainer.transition
      perspective: 500
      rotateX: 30
      width: '100%'
      height: '100%'
  $container.css 'overflow-x', 'hidden'

addPopup = ($triggerNode, popupContent, color='gray') ->
  popup = _.template popupTemplate,
    popupContent: popupContent
    color: color
  $triggerNode.hammer().on 'tap', (ev) ->
    $popup = $(popup)
    if $('.popup').length > 0
      $('.popup').remove()
    $popup.css 'left', ev.gesture.center.pageX
    $popup.css 'top', ev.gesture.center.pageY
    $('#popups').append $popup

init = ($container) ->
  $container.hammer().on 'tap', (ev) ->
    toggleView $container, ev.target

  ['blue', 'green', 'yellow', 'orange', 'red', 'purple'].forEach (color, index) ->
    $map = $ _.template(mapContainerTemplate,
      color: color
      index: index+1)
    $container.append $map

  glanceView $container

init $('#container')