class GoogleMap extends HTMLElement {
    constructor(options) {
        super();

        this.OPTIONS = options;
    }

    buildMap(){

        const OPTIONS = {
            center: { lat: 41.3869078, lng: 2.1696153 },
            zoom: 15,
            styles: [
                { "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
                { "elementType": "labels", "stylers": [{ "visibility": "off" }] },

                { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#efefef" }] },
                { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dbe5b0" }] },
                { "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#f8f8f8" }] },

                { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#999999" }, { "weight": 2 }] },
                { "featureType": "transit.line", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] },

                { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#999999"},{ "weight": 1 }] },
                { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] },

                { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#999999" },{"weight": 2}] },
                { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] },

                { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#666666" },{ "weight": 2}] },
                { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] },

                { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e1f2e5" }] }
            ],
            disableDefaultUI: true,
            draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true
        };

        let _DIV = document.createElement('div');
            _DIV.setAttribute('id','map');

        let map = new google.maps.Map(_DIV,OPTIONS);

        this.MAP = map;
        this.MAP_DIV = _DIV;

        let marker = new google.maps.Marker({
            position: { lat: 41.3869078, lng: 2.1696153 },
            map: map,
        });
        this.MARKER = marker;

        return [_DIV,map];
    }

    buildStyles(){

        let _STYLES = document.createElement('style');
            _STYLES.innerText = `
                #map {
                    height: 100%;
                    width: 100%;
                }
            `;

        return _STYLES;
    }

    setCenter({lat,lng}){
        let latlng = new google.maps.LatLng(lat,lng);
        
        this.MAP.panTo(latlng);
        this.MARKER.setPosition(latlng);
    }

    connectedCallback(){

        let shadow = this.attachShadow({mode: 'closed'});
        shadow.appendChild( this.buildStyles() );

        let [mapDiv,map] = this.buildMap();
        shadow.appendChild( mapDiv );
    }
}

customElements.define('g-map', GoogleMap);