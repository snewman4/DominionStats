import { api, LightningElement } from 'lwc';
import { BarChart } from 'my/d3Charts';

export default class ConnectedScatterGraph extends LightningElement {

    @api title = "Total Points Scored Chart";

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

    @api xkey = 'xkey';
    @api xlabel = 'This is X Axis'
    @api ykey = 'ykey';
    @api ylabel = 'This is Y Axis';

    // use d3.scalePoint for strings
    // use undefined for numbers (or dates?)
    @api xtype = undefined;
    @api ytype = undefined; // use undefined for numbers, that's the default

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
      if (!this.hasRendered)
        return;

      // Grab our data
      const data = this._data;

      // Pass it to the d3 wrapper function
      const xFn = (d) => d[this.xkey];
      const yFn = (d) => d[this.ykey];
      const csElement = BarChart(data, {
          xLabel: this.xlabel,
          x: xFn,
          xType: this.xtype, // scalePoint is an ordered list of strings
          xDomain: this.xtype !== undefined ? data.map(xFn) : undefined, // build the list of x data-points since the wrapper can't figure it out

          yLabel: this.ylabel,
          y: yFn,
          yType: this.ytype,
          yDomain: this.ytype !== undefined ? data.map(yFn) : undefined,

          defined: (d, i) => true,  // assume that all data is valid (the default checks for NaN, and strings from scalePoint are NaN)
          width: this.width,
          height: this.height
      });

      // Attach it to the element
      this.template.querySelector(".barchart").replaceChildren(csElement);
    }
} 
