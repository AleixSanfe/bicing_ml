class StationResume extends HTMLElement {

    constructor(target) {
        super();

        this.TARGET = target;

        this.shadow = this.attachShadow({mode: 'open'});
        this.__composeElements();
        target.appendChild(this);
    }

    async setContent(id = -1){

        let {station,records} = JSON.parse( await this.__requestData(id) );
        let state = await this.__requestStationState(id);
        //console.log(state);
        //console.log(records);

        //SET HEADER
        this.HEADER.textContent = station.id+" | "+station.name.split( /^[0-9]+\s*\-\s*/ )[1];

        //UPDATE MAP
        this.MAP.setCenter({lat: station.lat,lng: station.lng});

        //UPDATE BAR
        let total = state.num_bikes_available+state.num_docks_available;
        this.AVAILBAR.update( total , state.num_bikes_available_types.mechanical , state.num_bikes_available_types.ebike , state.num_docks_available );

        //BUILD GRAPHS

        //remove previous canvas
        Array.prototype.forEach.call( this.shadow.querySelectorAll('record-chart') , function( node ) {
            node.remove();
        });

        //build new canvas
        for(let record of records){
            let title = ""+(record.ini_dt.split("+")[0])+" - "+(record.fin_dt.split("+")[0])+"";
            this.shadow.appendChild( new RecordChart(record.id,title,record.values) );
        }
    }

    __composeElements(){

        let div = document.createElement('DIV');
            div.classList.add('wrapper');
            this.WRAPPER = div;

        let header = document.createElement('H1');
            this.HEADER = header;

        let map = new GoogleMap({ lat: 41.3947688, lng: 2.0787279 });
            map.classList.add('map');
            this.MAP = map;

        let availBar = new AvailableBar();
            this.AVAILBAR = availBar;

        div.appendChild(map);

        this.shadow.appendChild( this.__buildStyles() );

        this.shadow.appendChild(header);
        this.shadow.appendChild(div);
        this.shadow.appendChild(availBar);
    }

    __buildStyles(){

        let styles = document.createElement('STYLE');
        styles.textContent = `

            .wrapper{
                height: 250px;
                overflow-y: auto;
            }
        
            .map{
                width: 100%;
                height: 100px;
            }

        `;

        return styles;
    }

    __requestData(id){

        return new Promise( (resolve,reject) => {

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(xhttp.responseText);
                }
            };
            xhttp.open("GET", "/"+id+".json", true);
            xhttp.send();

        } );
    }

    async __requestStationState(id){

        function __getData(){
            return new Promise( (resolve,reject) => {

                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(xhttp.responseText);
                    }
                };
                xhttp.open("GET", "https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status", true);
                xhttp.send();
    
            } );
        }

        let {data} = JSON.parse( await __getData() );
        return data.stations.filter( s => parseInt(s.station_id) === id )[0];
    }
}

customElements.define('station-resume', StationResume);