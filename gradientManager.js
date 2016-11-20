/*
* author: tmirun
* version: 1.0.2
*          | | |
*          | | fix error
*          | change some thing important of library
*          new version of library
*/

/**
* this class manage the gradient in svg <b>requiered d3.js library</b> <br>
* reference: <a href='http://www.w3schools.com/svg/svg_grad_linear.asp'>w3school svg</a>
* @class GradientManager
* @constructor
* @param {d3.js dom} context example:d3.select('#svg_container')
*
* @example
* <pre>
*   var paper = d3.select('#svg_container');
*
*   var stops = [
*                   {
*                       offset: 0,
*                       style: "stop-color:rgba(255,255,0,0);"
*                    },
*                    {
*                        offset: 100,
*                        style: "stop-color:rgba(255,0,0,1);"
*                    }
*                ]
*
*    var gradient = new GradientManager(paper);
*    gradient.linearGradient('prueba');
*    gradient.gradientStop('prueba', stops);
*
*    paper.append("circle")
*        .attr("cx", 30)
*        .attr("cy", 30)
*        .attr("r", 20)
*        .attr('fill', 'url(#prueba)');
* </pre>
*/
function GradientManager(context){

    /**
    * @property context
    * @type {d3.js dom}
    */
    this.context = context;

    /**
    * example: {gradientId:[DOM linearGradientManager]}
    * @property gradients
    * @type {object}
    */
    this.gradients = {}; //{gradientId:[DOM linearGradientManager]}

    /**
    * dom element [defs] where save gradient in [svg]
    * @property defs
    * @type {dom}
    */
    this.defs;

    if(this.context.select("defs").empty()){
        this.defs = this.context.append("defs");
    }
    else{
        this.defs = this.context.select("defs");
    }
}

/**
* create linegradient element insite [defs] dom element
* @method linearGradient
* @param {number|string} id id of gradient element: [linearGradient id="{id}"];
* @param {number} deg angle in "degº" of gradient
* @param {object} attr set [defs] element attributes
*/
GradientManager.prototype.linearGradient = function(id , deg, attr){

    var deg = deg || 0;
    var attr = attr || {};
    var gradient;

    if(this.defs.select("#"+id).empty()){

        gradient = this.defs.append("linearGradient")
        gradient.attr("id",id)
                .attr("gradientTransform", "rotate("+deg+")")
                .attr(attr);
    }

    else{
        gradient = this.defs.select("#"+id);
    }

    this.gradients[id] = gradient;
}

/**
* create lineargradient with id
* @method gradientStop
* @param {string|number} id of gradient
* @param {object} gradient object
*/
GradientManager.prototype.gradientStop = function(id, stops){
    /* stops=
    [
        {
            offset: "0%",
            style: "stop-color:rgba(255,255,0,0);"
        }
        ....
    ]*/
    var gradient = this.getGradient(id);

    function createNew(){
        gradient.selectAll("stop")
            .data(stops)
            .enter()
            .append("stop")
            .each(function(d) {
                var element = d3.select(this);
                d3.keys(d).forEach(function(key){
                   element.attr(key, d[key]);
                });
            })
    }

    if(gradient.selectAll("stop").empty())

        createNew();

    else{

        if(gradient.selectAll("stop").size() != stops.length){
            gradient.selectAll("stop").remove();
            createNew();
        }

        else{
            gradient.selectAll("stop")
                .data(stops)
                .each(function(d) {
                    var element = d3.select(this);
                    d3.keys(d).forEach(function(key){
                       element.attr(key, d[key]);
                    });
                })
        }
    }
}

/**
* get gradient by id
* @method getGradient
* @param {string|number} id of gradient
* @return {d3.DOM} gradientElement
*/
GradientManager.prototype.getGradient = function(id){
    return this.gradients[id];
}
