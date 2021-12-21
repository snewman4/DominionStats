import { api, LightningElement } from 'lwc';
import { DonutChart } from 'my/d3Charts';

export default class ConnectedScatterGraph extends LightningElement {
    @api title = 'Place Frequency Graph';

    // Must be in the form [{name: string, value: number}]
    // Using a setter gives us a reactive hook to re-render the graph if the data changes
    @api
    set data(d) {
        this._data = d;
        this.renderGraph();
    }
    get data() {
        return this._data;
    }
    _data = [];

    @api width = 1280;
    @api height = 720;

    renderedCallback() {
        this.hasRendered = true;
        // Setter is not called if we are initialized with data, so start off rendering the graph
        this.renderGraph();
    }

    async renderGraph() {
        // The querySelector at the bottom of this function requires that the component has rendered at least once (and is attached to the DOM)
        // If we haven't rendered yet, wait for renderedCallback to be invoked, and draw the graph then
        if (!this.hasRendered) return;

        const csElement = DonutChart(this._data, {
            name: (d) => d.name,
            value: (d) => d.value,
            width: this.width,
            height: this.height
        });

        // Attach it to the element
        this.template.querySelector('.chart').replaceChildren(csElement);
    }
}
