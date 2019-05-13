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
var url2;
var jsondata1;
var jsondata2;
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

//Show amenity info when clicked
var eachFeatureFunction0 = function(layer) {
  layer.on('click', function (event) {
      $("#boxinfo").show();
      $('#info').show();
      $('#schools').text("Name: " + layer.feature.properties.FACIL_NAME + "; Level:" + layer.feature.properties.GRADE_LEVEL);
    }
)};

var eachFeatureFunction2 = function(layer) {
  layer.on('click', function (event) {
      $("#boxinfo").show();
      $('#info').show();
      $('#hospitals').text("Name: " + layer.feature.properties.FACILITY_N + "   " + layer.feature.properties.FACILITY_U);
    }
)};

var eachFeatureFunction3 = function(layer) {
  layer.on('click', function (event) {
      $("#boxinfo").show();
      $('#info').show();
      $('#farmermarkets').text("Name: " + layer.feature.properties.NAME + "; Time: " + layer.feature.properties.TIME);
    }
)};

var eachFeatureFunction4 = function(layer) {
  layer.on('click', function (event) {
      $("#boxinfo").show();
      $('#info').show();
      $('#railstations').text("Name: " + layer.feature.properties.STATION + "; Line: " + layer.feature.properties.LINE);
    }
)};

//Define reset button
$("#reset").click(()=> {
  $(".sidebar").hide();
  document.getElementById('address').value = '';
  map.removeLayer(markerLayer);
});
