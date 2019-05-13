//Import map
var map = L.map('map', {
  center: [39.952693, -75.163486],
  zoom: 12
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

//Hide sidebar
$(".sidebar").hide();

//Default value of input box
$('#address').val('1900 Market St');

//Import data
//School
var school = "https://raw.githubusercontent.com/YangWangPENN/Resources-for-final/master/Schools.geojson";
$(document).ready(function() {
  $.ajax(school).done(function(data) {
    var parsedData=JSON.parse(data);
    var featureGroup = L.geoJson(parsedData, {
           pointToLayer: function(feature, latlng) {
           return L.circleMarker(latlng, myStyle0(feature));
     }
     }).addTo(map);
     featureGroup.eachLayer(eachFeatureFunction0);
  })
});

var myStyle0 = function(feature){
  switch(feature.properties.TYPE) {
    case 'Private': return {
      radius: 4,
      fillColor: "#fdfefe",
      color: "#f6d122",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    case 'District': return {
      radius: 4,
      fillColor: "#fdfefe",
      color: "#f68b22",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    case 'Charter': return {
      radius: 4,
      fillColor: "#fdfefe",
      color: "#6cb931",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
};

//Park
$.getJSON("PPR_Assets.geojson",function(data){
  L.geoJson(data, {style: myStyle1}).addTo(map);
});

var myStyle1 = {
  "color": "#a9dfbf",
   "weight": 1,
   "opacity": 0.65
};

//Hospital
var hospital = "https://raw.githubusercontent.com/YangWangPENN/Resources-for-final/master/Hospitals.geojson";

function createCustomIcon2 (feature, latlng) {
  let hospitalIcon = L.icon({
    iconUrl: 'Icon2.png',
    iconSize:     [18, 18],
    iconAnchor:   [12, 12],
    popupAnchor:  [0, 0]
  })
  return L.marker(latlng, { icon: hospitalIcon })
}

var myFilter2 = function(feature) {
  if(feature.properties.COUNTY === 'PHILADELPHIA'){
    return true;
  } else {
    return false;
  }
};

let myLayerOptions2 = {
  pointToLayer: createCustomIcon2,
  filter: myFilter2
}

$(document).ready(function() {
  $.ajax(hospital).done(function(data) {
    var parsedData = JSON.parse(data);
    var featureGroup = L.geoJson(parsedData,myLayerOptions2).addTo(map);
    featureGroup.eachLayer(eachFeatureFunction2);
  });
});

//Farmers Markets
var farmersMarket = "https://raw.githubusercontent.com/YangWangPENN/Resources-for-final/master/Farmers_Markets.geojson";

function createCustomIcon3 (feature, latlng) {
  let marketIcon = L.icon({
    iconUrl: 'Icon3.png',
    iconSize:     [18, 18],
    iconAnchor:   [12, 12],
    popupAnchor:  [0, 0]
  })
  return L.marker(latlng, { icon: marketIcon })
}

let myLayerOptions3 = {
  pointToLayer: createCustomIcon3
}

$(document).ready(function() {
  $.ajax(farmersMarket).done(function(data) {
    var parsedData = JSON.parse(data);
    var featureGroup = L.geoJson(parsedData,myLayerOptions3).addTo(map);
    featureGroup.eachLayer(eachFeatureFunction3);
  });
});


//Rail Station
var railStation = "https://raw.githubusercontent.com/YangWangPENN/Resources-for-final/master/Rail_Stations.geojson";

function createCustomIcon4 (feature, latlng) {
  let railIcon = L.icon({
    iconUrl: 'Icon4.png',
    iconSize:     [18, 18],
    iconAnchor:   [12, 12],
    popupAnchor:  [0, 0]
  })
  return L.marker(latlng, { icon: railIcon })
}

var myFilter4 = function(feature) {
  if(feature.properties.COUNTY === 'Philadelphia'){
    return true;
  } else {
    return false;
  }
};


let myLayerOptions4 = {
  pointToLayer: createCustomIcon4,
  filter: myFilter4
}

$(document).ready(function() {
  $.ajax(railStation).done(function(data) {
    var parsedData = JSON.parse(data);
    var featureGroup = L.geoJson(parsedData,myLayerOptions4).addTo(map);
    featureGroup.eachLayer(eachFeatureFunction4);
  });
});

//Get the input address and mark it on the map when clicked
var input;
var result;
var url1;
var jsondata1;
var lng;
var lat;

var myMarker = L.icon({
  iconUrl:'marker.png',
  iconSize:     [30, 30],
  iconAnchor:   [12, 12],
  popupAnchor:  [0, 0]
});

var markerLayer;

$("#search").click(() => {
   $(".sidebar").show();
   $("#boxinfo").hide();
  input=document.getElementById('address').value;
  url1='https://api.mapbox.com/geocoding/v5/mapbox.places/' + input + '.json?access_token=pk.eyJ1IjoicmVwYXJvIiwiYSI6ImNqdGtlaW5ubzAyNzk0M3BoaWtjNTRkcG0ifQ.zIoid_0qjvLcr2fTtyxhxQ'
  $.ajax(url1).done(function(res) {
    jsondata1=res;
    lng=jsondata1.features[0].geometry.coordinates[0];
    lat=jsondata1.features[0].geometry.coordinates[1];
    map.setView([lat, lng],16);
    markerLayer=L.marker([lat,lng],{icon:myMarker}).addTo(map);
  })
});

//Lowercase the texts except for the first letter
function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}

//Define initial state of the optimized route
var state = {
  count: 0,
  markers: [],
  line: undefined,
}

//Show amenity info and the optimized routewhen clicked
var lng0;
var lat0;
var url0;

var eachFeatureFunction0 = function(layer) {
  layer.on('click', function (event) {
    if (typeof state.line !== 'undefined') {
      map.removeLayer(state.line);
    };
      $("#boxinfo").show();
      $('#info').show();
      var schoolName=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.FACIL_NAME.toLowerCase()));
      var level=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.GRADE_LEVEL.toLowerCase()));
      $('#schools').text("Name: " + schoolName + "; Level:" + level);
      lng0=layer.feature.geometry.coordinates[0];
      lat0=layer.feature.geometry.coordinates[1];
      url0 = "https://api.mapbox.com/optimized-trips/v1/mapbox/walking/" + lng + "," + lat + ";" + lng0 + "," + lat0 + "?access_token=pk.eyJ1IjoicmVwYXJvIiwiYSI6ImNqdGtlaW5ubzAyNzk0M3BoaWtjNTRkcG0ifQ.zIoid_0qjvLcr2fTtyxhxQ";
      $.ajax({
        url: url0,
        success: function(res) {
          var latlngs = decode(res.trips[0].geometry);
          state.line=L.polyline(latlngs, {color: '#a9cce3'}).addTo(map);
        }
      });
    }
)};



var eachFeatureFunction2 = function(layer) {
  layer.on('click', function (event) {
    if (typeof state.line !== 'undefined') {
      map.removeLayer(state.line);
    };
      $("#boxinfo").show();
      $('#info').show();
      var hospitalName=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.FACILITY_N.toLowerCase()));
      $('#hospitals').text("Name: " + hospitalName + "   " + layer.feature.properties.FACILITY_U);
      lng0=layer.feature.geometry.coordinates[0];
      lat0=layer.feature.geometry.coordinates[1];
      url0 = "https://api.mapbox.com/optimized-trips/v1/mapbox/walking/" + lng + "," + lat + ";" + lng0 + "," + lat0 + "?access_token=pk.eyJ1IjoicmVwYXJvIiwiYSI6ImNqdGtlaW5ubzAyNzk0M3BoaWtjNTRkcG0ifQ.zIoid_0qjvLcr2fTtyxhxQ";
      $.ajax({
        url: url0,
        success: function(res) {
          var latlngs = decode(res.trips[0].geometry);
          state.line=L.polyline(latlngs, {color: '#a9cce3'}).addTo(map);
        }
      });
    }
)};

var eachFeatureFunction3 = function(layer) {
  layer.on('click', function (event) {
    if (typeof state.line !== 'undefined') {
      map.removeLayer(state.line);
    };
      $("#boxinfo").show();
      $('#info').show();
      var farmerName=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.Name.toLowerCase()));
      $('#farmermarkets').text("Name: " + farmerName + "; Time: " + layer.feature.properties.TIME);
      lng0=layer.feature.geometry.coordinates[0];
      lat0=layer.feature.geometry.coordinates[1];
      url0 = "https://api.mapbox.com/optimized-trips/v1/mapbox/walking/" + lng + "," + lat + ";" + lng0 + "," + lat0 + "?access_token=pk.eyJ1IjoicmVwYXJvIiwiYSI6ImNqdGtlaW5ubzAyNzk0M3BoaWtjNTRkcG0ifQ.zIoid_0qjvLcr2fTtyxhxQ";
      $.ajax({
        url: url0,
        success: function(res) {
          var latlngs = decode(res.trips[0].geometry);
          state.line=L.polyline(latlngs, {color: '#a9cce3'}).addTo(map);
        }
      });
    }
)};

var eachFeatureFunction4 = function(layer) {
  layer.on('click', function (event) {
    if (typeof state.line !== 'undefined') {
      map.removeLayer(state.line);
    };
      $("#boxinfo").show();
      $('#info').show();
      var stationName=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.STATION.toLowerCase()));
      var lineName=upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(layer.feature.properties.LINE.toLowerCase()));
      $('#railstations').text("Name: " + stationName + "; Line: " + lineName);
      lng0=layer.feature.geometry.coordinates[0];
      lat0=layer.feature.geometry.coordinates[1];
      url0 = "https://api.mapbox.com/optimized-trips/v1/mapbox/walking/" + lng + "," + lat + ";" + lng0 + "," + lat0 + "?access_token=pk.eyJ1IjoicmVwYXJvIiwiYSI6ImNqdGtlaW5ubzAyNzk0M3BoaWtjNTRkcG0ifQ.zIoid_0qjvLcr2fTtyxhxQ";
      $.ajax({
        url: url0,
        success: function(res) {
          var latlngs = decode(res.trips[0].geometry);
          state.line=L.polyline(latlngs, {color: '#a9cce3'}).addTo(map);
        }
      });
    }
)};

//Define reset button
$("#reset").click(()=> {
  $(".sidebar").hide();
  document.getElementById('address').value = '';
  map.removeLayer(markerLayer);
  map.removeLayer(state.line);
});
