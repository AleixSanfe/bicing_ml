class StationInfo extends HTMLElement {
    constructor(options) {
        super();

        this.OPTIONS = options;
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadow.appendChild( this.buildStyles() );
        this.shadow.appendChild( this.buildContent() );
    }

    buildContent(){

        let _id = this.getAttribute('name').split(' - ')[0];
        let _name = this.getAttribute('name').split(' - ')[1];

        let div = document.createElement('DIV');
            div.classList.add('container');
            div.addEventListener('click',(e) => this.OPTIONS.callback( parseInt(_id) ))

        let il = document.createElement('DIV');
            il.classList.add('left');
            il.textContent = _id;

        let ir = document.createElement('DIV');
            ir.classList.add('right');
            ir.textContent = _name;

        div.appendChild(il);
        div.appendChild(ir);
        return div;
    }

    buildStyles(){
        let style = document.createElement('style');

        style.textContent = `
            .container {
                display: flex;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }

            .left{
                width: 20%;
                line-height: 45px;

                color: #0c8bd6;
                font-weight: bolder;
                border-right: 1px solid #0c8bd6;
                margin-right: 4px;
            }

            .right{
                flex: 1;
                text-align: left;
                color: lightslategray;
                font-style: italic;
            }
        `;

        return style;
    }
}

customElements.define('station-info', StationInfo);