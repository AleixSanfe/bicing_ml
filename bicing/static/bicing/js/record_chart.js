class RecordChart extends HTMLElement {

    constructor(index,title,values) {
        super();

        this.VALUES = values;
        this.TITLE = title;
        this.IDX = index;

        this.shadow = this.attachShadow({mode: 'open'});
        this.__composeElements();
    }

    connectedCallback(){

        let canvas = this.CANVAS;

        let ctx = canvas.getContext('2d');
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys( this.VALUES ),
                datasets: [
                    {
                        label: 'bikes available',
                        data: this.__softWeek( Object.values( this.VALUES ).map( (e) => e.c == 0 ? 0 : parseInt(e.ba / e.c) ) ),
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderColor: 'red',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: false,
                            maxTicksLimit: 29
                        }
                    }]
                },
                responsive:true,
                maintainAspectRatio: false,
                title: {
                    text: this.TITLE,
                    display: true
                },
                legend: {
                    display: false
                }
            }
        });
    }

    __composeElements(){

        let div = document.createElement('DIV');
            div.classList.add('wrapper');

        let canvas = document.createElement('CANVAS');
            canvas.setAttribute("id","record_chart_"+this.IDX);
            this.CANVAS = canvas;

        div.appendChild(canvas);

        this.shadow.appendChild( this.__buildStyles() );
        this.shadow.appendChild(div);
    }

    __buildStyles(){

        let styles = document.createElement('STYLE');
        styles.textContent = `

            .wrapper{
                height: 250px;
                overflow-y: auto;
            }
        
            canvas{
                width: 100%;
                height: 100%;
            }

        `;

        return styles;
    }

    __softWeek(values){
        
        let V = [...values];
        let l = values.length - 1;
        for(let i in values){

            const J = parseInt(i);
            if( J === 0 || J === l )continue;
                    
            let p = values[J - 1];
            let c = values[J + 0];
            let n = values[J + 1];

            V[i] =  Math.floor( (p + c + n)/3 );
        }
            
        return V;
    }
}

customElements.define('record-chart', RecordChart);