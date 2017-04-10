var infowindow;
var viewModel;
var map;
var markerList = [];

$(function() {
	var placesInSFO = [{
		name: "Baker Beach",
		address: "1504 Pershing Dr, CA: 94129",
		lat: 37.7932,
		lng: -122.4840,
		type: "Beach",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.7920,-122.4840&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Ocean Beach",
		address: "712 Great Hwy, CA: 94121",
		lat: 37.774,
		lng: -122.5125,
		type: "Beach",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=3.774,-122.5125&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Golden Gate Park",
		address: "501 Stanyan St, CA: 94117",
		lat: 37.7697,
		lng: -122.4769,
		type: "Park",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=32.750,-117.2517&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Buena Vista Park",
		address: "Point Lobos Ave, CA: 94121",
		lat: 37.7682033,
		lng: -122.4417696,
		type: "Park",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=35.2385,-119.32761&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Coffee Shop",
		address: "3139 Mission St, CA: 94110",
		lat: 37.7471084,
		lng: -122.4189216,
		type: "Coffee",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.7471084,-122.4189216&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Sightglass Coffee",
		address: "270 7th St, CA: 94103",
		lat: 37.7770072,
		lng: -122.4084523,
		type: "Coffee",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.7770072,-122.4084523&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Four Barrel Coffee",
		address: "375 Valencia St, CA: 94103",
		lat: 37.7670275,
		lng: -122.422032,
		type: "Coffee",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.7670275,-122.422032&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Za Pizza",
		address: "1919 Hyde St, CA: 94109",
		lat: 37.7985464,
		lng: -122.4190689,
		type: "Pizza",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.7985464,-122.4190689&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Tony's Pizza",
		address: "1570 Stockton St, CA: 94133",
		lat: 37.8003066,
		lng: -122.4091132,
		type: "Pizza",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.8003066,-122.4091132&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Golden Boy Pizza",
		address: "542 Green St, CA: 94133",
		lat: 37.799694,
		lng: -122.4081015,
		type: "Pizza",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.799694,-122.4081015&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Golden Gate Bridge",
		address: "Golden Gate Bridge, CA: 94124",
		lat: 37.8197,
		lng: -122.4786,
		type: "Bridges",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.8197,-122.4786&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, {
		name: "Bay Bridge",
		address: "Oakland Bay Bridge, CA: 94124",
		lat: 37.8197,
		lng: -122.3438,
		type: "Bridges",
		show: ko.observable(true),
		url: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=37.8197,-122.3438&key=AIzaSyC9N935aVozx1bzUZe1kXTzlLv_4auga4g"
	}, ];

	var MyViewModel = function() {
		var self = this;
		self.placesInSFO = [];
		for (var x in placesInSFO) {
			self.placesInSFO.push(placesInSFO[x]);
		}
		self.filteredPlacesInSFO = ko.observableArray(placesInSFO);
		self.query = ko.observable('');
		self.search = function(value) {
			self.filteredPlacesInSFO.removeAll();
			for (var x in self.placesInSFO) {
				if (self.placesInSFO[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					self.filteredPlacesInSFO.push(self.placesInSFO[x]);
				}
			}
			var searchPlaces = self.filteredPlacesInSFO();
			clearMarkers();
			setMarkers(map, searchPlaces);
		};
		self.locationClicked = function(value) {
			for (var markerIndex in markerList) {
				if (value.name == markerList[markerIndex].title) {
					google.maps.event.trigger(markerList[markerIndex], 'click');
				}
			}
		};
		self.query.subscribe(self.search);

	};
	viewModel = new MyViewModel();

	ko.applyBindings(viewModel);
});


function initGoogle() {
	var currCenter = new google.maps.LatLng(37.7833, -122.4167);
	var mapOptions = {
		zoom: 11,
		center: currCenter
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	setMarkers(map, viewModel.filteredPlacesInSFO());
	infowindow = new google.maps.InfoWindow();
	google.maps.event.trigger(map, 'resize');
	map.setCenter(currCenter);
}

function googleError() {
	console.log("Map cannot be loaded at the time!");
	alert("ERR_INTERNET_NOTCONNECTED");
}

function setMapOnAll(map) {
	for (var i = 0; i < markerList.length; i++) {
		markerList[i].setMap(map);
	}
	markerList.length = 0;
}

function clearMarkers() {
	setMapOnAll(null);
}

function setMarkers(map, places) {
	places.forEach(function(places, index) {
		if (places.show()) {
			var contents = '<h3 id="firstHeading" class="firstHeading">' + places.name + '</h1>' + '<em>' + 'Type: ' + places.type + ' ' + ' ' + '</em>' + '<h4>' + places.address + '</h4>' + '<a href="' + places.url + '">' + 'Street View </a>';
			var fsLink = "https://api.foursquare.com/v2/venues/search?client_id=V1YYR5DNVCXPPOO411XSDUHJR0ASKOVCUDFT1JZ2OHQIN5U4&client_secret=QVJPVW4IHOR2LMZHK0HJ1NIXC4DHEXNIPIKSLKB1242RIKYG&v=20130815&ll=" + places.lat + "," + places.lng + "&query=" + places.name;
			var latlong = new google.maps.LatLng(places.lat, places.lng);
			var venues = "";
			$.ajax({
					url: fsLink,
					dataType: "jsonp"
				})
				.done(function(response) {
					venues = response.response.venues[0];
					contents = contents + "Foursqure Phone:  " + (venues.contact.formattedPhone ? venues.contact.formattedPhone : "Not Available");
				})
				.fail(function(error) {
					contents = contents + "Sorry, we cannot find a ph# for" + " " + placesInSFO.name + " " + "at this time.";
				});

			var marker = new google.maps.Marker({
				position: latlong,
				animation: google.maps.Animation.DROP,
				map: map,
				title: places.name,
				url: viewModel.filteredPlacesInSFO.url,
			});

			google.maps.event.addListener(marker, 'click', toggleBounce);

			function toggleBounce() {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
						marker.setAnimation(null);
					}, 2100);
				}
			}

			google.maps.event.addListener(marker, 'click', (function(marker) {
				return function() {
					infowindow.setContent(contents);
					infowindow.open(map, this);
				};
			})(marker));

			markerList.push(marker);
		}
	});
}