---
title: Load Markers For Visible Area
page_title: Load Markers For Visible Area | Kendo UI Map
description: "Learn how to load markers only for the visible area of a Kendo UI Map widget."
slug: howto_loadmarkers_map
---

# Load Markers For Visible Area

The following example demonstrates how to filter the data for a marker layer depending on the visible area of the Kendo UI Map.

```dojo
<div id="map"></div>
<script>
function createMap() {
  var markerData = new kendo.data.DataSource({
    transport: {
      read: {
        /* Specify the url from which the markers will be requested. */
        url: "https://demos.telerik.com/kendo-ui/content/dataviz/map/store-locations.json",
        dataType: "json"
      }
    }
  });

  function updateMarkers(e) {
    var extent = e.sender.extent();
    /* Send the North West and South West locations of the currently visible map to the server in order to filter the markers which should be retrieved. */
    markerData.read({
      nw: extent.nw.toString(),
      se: extent.se.toString()
    });
  }

  $("#map").kendoMap({
    center: [30.268107, -97.744821],
    zoom: 15,
    layers: [{
      type: "tile",
      urlTemplate: "https://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
      subdomains: ["a", "b", "c"],
      attribution: "&copy; <a href='https://osm.org/copyright'>OpenStreetMap contributors</a>." +
      "Tiles courtesy of <a href='https://www.opencyclemap.org/'>Andy Allan</a>"
    }, {
      type: "marker",
      dataSource: markerData,
      locationField: "latlng",
      titleField: "name"
    }],
    // Request the new markers when the viewport is reset...
    reset: updateMarkers,
    // ...and after a pan operation.
    panEnd: updateMarkers
  });
}

$(document).ready(createMap);
</script>
```

## See Also

* [Basic Usage of the Map (Demo)](https://demos.telerik.com/kendo-ui/map/index)
* [Using the API of the Map (Demo)](https://demos.telerik.com/kendo-ui/map/api)
* [JavaScript API Reference of the Map](/api/javascript/dataviz/ui/map)
