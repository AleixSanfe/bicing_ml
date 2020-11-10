class StationList extends HTMLElement {

    constructor(stations,target,options) {
        super();

        this.STATIONS = stations;
        this.OPTIONS = options;

        this.shadow = this.attachShadow({mode: 'open'});
        this.composeElements();
        target.appendChild(this);
    }

    buildSearcher(){

        let input = document.createElement("INPUT");
            input.setAttribute("type","text");
            input.addEventListener('keyup',(e) => { this.filterList(e) })

        let i = document.createElement("I");
            i.textContent = 'Found: '+this.STATIONS.length+" stations";

        return [input,i];
    }

    buildList(list = this.STATIONS){

        let div = document.createElement("DIV");
            div.classList.add('list');

        let ul = document.createElement("UL");
        
        for(let s of list){
            let li = document.createElement("LI");
            let sI = new StationInfo({callback: this.OPTIONS.callback});
                sI.setAttribute("name",s.name.replace(`&#39;`,`'`) );

            li.appendChild(sI);
            ul.appendChild(li);
        }

        div.appendChild(ul);
        return div;
    }

    composeElements(){

        let wrapper = document.createElement("DIV");
            wrapper.classList.add('wrapper');

        wrapper.appendChild( this.buildStyles() );
        if( this.OPTIONS.searchable ){
            let elems = this.buildSearcher();
            for(let el of elems){
                wrapper.appendChild( el );
            }
        }
        wrapper.appendChild( this.buildList() );

        this.WRAPPER = wrapper;
        this.shadow.appendChild(wrapper);
    }

    filterList(event){
        
        let filter = event.target.value;
        clearTimeout( this.inputKeyUpTimeOut );

        let _compareName = (n,f) => {
            n = n.replace(`&#39;`,`'`);
            return ( n.toLowerCase().includes(f.toLowerCase()) );
        }

        let _compareId = (id,f) => {
            return ( parseInt(id) === parseInt(f) );
        }

        let _filter = () => {

            let filtered = [];
            for(let s of this.STATIONS){
                if( _compareName(s.name , filter) || _compareId(s.id,filter) )filtered.push(s)
            }

            let newlist = this.buildList(filtered);
            this.WRAPPER.replaceChild( newlist , this.WRAPPER.childNodes[3] );
        }

        this.inputKeyUpTimeOut = setTimeout( _filter , 300);
    }

    buildStyles(){

        let styles = document.createElement('STYLE');
        styles.textContent = `

            .wrapper{
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        
            input{
                width: 100%;
                height: 50px;
                border: none;
                border-bottom: 1px solid #cccccc;
                box-sizing: border-box;
                line-height: 35px;
                font-size: 1.5rem;


                background-image: url('/static/bicing/img/search.png');
                background-size: 25px;
                background-position: 5px;
                background-repeat: no-repeat;
                padding-left: 30px;
            }

            input:focus{
                outline-width: 0;
                border-color: #0c8bd6;
            }

            i{
                height: 20px;
                line-height: 20px;
                color: lightslategray;
            }
    
            ul{
                list-style: none;
                padding: 0;
            }

            li{
                height: 45px;
                border-bottom: 1px solid #ccc;
                margin: 0px 5px;
            }

            .list{
                flex: 1;
                overflow-y: auto;
            }

        `;

        return styles;
    }
}

customElements.define('station-list', StationList);