class AvailableBar extends HTMLElement {
    constructor(options) {
        super();

        this.OPTIONS = options;

        this.shadow = this.attachShadow({mode: 'open'});
        this.__composeElements();
    }

    update(t,ma,ea,da){

        this.MECH.style.width = ( (ma / t)*100 )+'%';
        this.MECH.textContent = ma;
        this.ELEC.style.width = ( (ea / t)*100 )+'%';
        this.ELEC.textContent = ea;

        this.FREE.textContent = da;
        if(da === 0)this.FREE.style.display = 'none';
        else this.FREE.style.display = 'initial';
    }

    __composeElements(){

        this.MECH = document.createElement('DIV');
        this.MECH.classList.add('mech');

        this.ELEC = document.createElement('DIV');
        this.ELEC.classList.add('elec');

        this.FREE = document.createElement('DIV');
        this.FREE.classList.add('free');


        let div = document.createElement('DIV');
            div.classList.add('bar')
        div.appendChild(this.MECH);
        div.appendChild(this.ELEC);
        div.appendChild(this.FREE);

        this.shadow.appendChild( this.__buildStyles() );
        this.shadow.appendChild(div);
    }

    __buildStyles(){

        let styles = document.createElement('style');
        styles.innerText = `
            .bar {
                display: flex;
                height: 25px;
                margin: 15px 0px;
            }

            .mech{
                background-color: #ff4747;
            }

            .elec{
                background-color: #47aaff;
            }

            .free{
                background-color: #dedede;
                flex: 1;
                color: black !important;
            }

            .mech,.elec,.free{
                color: white;
                text-align: center;
                line-height: 25px;
            }
        `;

        return styles;
    }
}

customElements.define('available-bar', AvailableBar);