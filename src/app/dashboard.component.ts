// Dashboard
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { AfterViewInit }              from '@angular/core';
import { ViewEncapsulation }          from '@angular/core';

import { Directive }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { Renderer }                   from '@angular/core';
import { ViewChild }                  from '@angular/core';
import { ViewChildren }               from '@angular/core';
import { QueryList }                  from '@angular/core';

// PrimeNG
import { MenuItem }                   from 'primeng/primeng';  
import { Message }                    from 'primeng/primeng';  
import { SelectItem }                 from 'primeng/primeng';  
import { SharedModule }               from 'primeng/primeng';  
import { TreeNode }                   from 'primeng/primeng';  

// Our Components
// import { BarCharBuilder }             from './vega.barchart.spec';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
// import { specTS } from './vega.barchart.spec';

// Vega stuffies
let vg = require('vega/index.js');

// Our data
import { dashboardTree }              from '../assets/data.dashboard.tree'

export interface DataSource {
    name: string;
    type: string;
    description: string
}

var spec = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 250,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "table",
      "values": [
        {"category": "A", "amount": 28},
        {"category": "B", "amount": 55},
        {"category": "C", "amount": 43},
        {"category": "D", "amount": 91},
        {"category": "E", "amount": 81},
        {"category": "F", "amount": 53},
        {"category": "G", "amount": 19},
        {"category": "H", "amount": 87}
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "category"},
      "range": "width"
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "category", "offset": 1},
          "width": {"scale": "xscale", "band": 1, "offset": -1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
}

// BarChart properties
var barChartWidth: number = 250;
var currentBarChart: string = 'barChart1';
var barChartWidth1: number = 250;
var barChartWidth2: number = 250;
var barChartContainerColor1: string = 'gray';
var barChartContainerColor2: string = 'lightgray';
var nrBarChartsShown: number = 0;


 
@Component({
    selector:    'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls:  ['dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {

    @ViewChild('testing') elTesting: ElementRef;
    @ViewChildren('testing') childrenTesting: QueryList<ElementRef>;
    @ViewChild('vegaBarChart1') elementvegaBarChart1:ElementRef;
    @ViewChild('vegaBarChart2') elementvegaBarChart2:ElementRef;
    // @ViewChild('inputBoxTest') elementinputBoxTest: ElementRef;

    // Local properties
    addEditMode: string;
    dashboardList:  SelectItem[];
    lineChartHeader: string = 'Contracts per Month';
    pieChartHeader: string = 'Top 10 shares';
    lineChartIsVisible: boolean = false;
    pieChartIsVisible: boolean = false;
    dashboards: TreeNode[];
    selectedDashboard: string = '';
    filterDashboard: string = '';
    popuMenuItems: MenuItem[];
    selectedFiles: TreeNode[];
    dataSourceFields: DataSource[];
    radioLabelval1: string;
    checkedScale: boolean;
    showBarChart1: boolean = true;  
    showBarChart2: boolean = true;  
    // barChartLeft1: number = 280;             // Left op BarChart in px  
    barChartLeft1: number = 280;             // Left op BarChart in px  
    barChartLeft2: number = 590;             // Left op BarChart in px  
    barChartTop1: number = 4.5;              // Top of BarChart in em
    barChartTop2: number = 4.5;              // Top of BarChart in em
    mouseDownX1: number;                     // Mouse position at start of drag
    mouseDownX2: number;                     // Mouse position at start of drag
    mouseDownY1: number;                     // Mouse position at start of drag
    mouseDownY2: number;                     // Mouse position at start of drag
    showPalette: boolean = false;
    chartWidth: number;
    months: SelectItem[];
    selectedMonth: string[] = [];
    showMonths: boolean = false;
    rangeValues: number[] = [20,80];
testingShow:boolean = false;
testing:  string[] = ['A','B','C'];
testingX: number;
testingY: number;
    // BarChart properties
    chartBackgroundColor: SelectItem[];
    selectedBackgroundColor: string;

    constructor(
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer : Renderer, 
        private element : ElementRef
        ) {
        this.chartBackgroundColor = [];
        this.chartBackgroundColor.push({label:'Blue', value:{id:1, name: 'blue', code: 'blue'}});
        this.chartBackgroundColor.push({label:'White', value:{id:1, name: 'white', code: 'white'}});
        this.chartBackgroundColor.push({label:'Orange', value:{id:1, name: 'orange', code: 'orange'}});

        this.months = [];
        this.months.push({label: 'Jan', value: 'Jan'});
        this.months.push({label: 'Feb', value: 'Feb'});
        this.months.push({label: 'Mar', value: 'Mar'});
        this.months.push({label: 'Apr', value: 'Apr'});
        this.months.push({label: 'May', value: 'May'});
        this.months.push({label: 'Jun', value: 'Jun'});
        this.months.push({label: 'Jul', value: 'Jul'});
        this.months.push({label: 'Aug', value: 'Aug'});
        this.months.push({label: 'Sep', value: 'Sep'});
        this.months.push({label: 'Oct', value: 'Oct'});
        this.months.push({label: 'Nov', value: 'Nov'});
        this.months.push({label: 'Dec', value: 'Dec'});
    }
    
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        this.dashboards=dashboardTree;
        this.dashboardList = [];
        this.dashboardList.push({label: 'Head Count', value: 'Head Count'});
        this.dashboardList.push({label: 'Weekly Stats', value: 'Weekly Stats'});
        this.dataSourceFields = [
            {  
                'name': 'Month',
                'type': 'string',
                'description': 'bla-bla-bla'
            },
            {  
                'name': 'WeekNr',
                'type': 'number',
                'description': 'bla-bla-bla'
            },
            {  
                'name': 'Value',
                'type': 'number',
                'description': 'bla-bla-bla'
            },
            {  
                'name': 'Volume',
                'type': 'number',
                'description': 'bla-bla-bla'
            }
        ];

        // Initialise variables
        // this.popuMenuItems = [
        //     {
        //         label: 'Add', 
        //         icon: 'fa-plus', 
        //         command: (event) => this.userMenuAdd(this.selectedUser)
        //     },
        //     {
        //         label: '______________________________', 
        //         icon: '',
        //         disabled: true 
        //     }
        // ];
    }

    ngAfterViewInit() {
        console.log ('we shall see');
        console.log(this.elTesting);
        console.log ('the kids')
        console.log(this.childrenTesting.toArray());
        console.log(this.childrenTesting.toArray()[1].nativeElement)
    }


    onKeyDashboard(event: any) { // without type info
        this.globalFunctionService.printToConsole(this.constructor.name,'onKeyDashboard', '@Start');
        let filterString: string = event.target.value.toString();
        console.log('filtering on: ' + filterString.toLowerCase());

        this.dashboards= (dashboardTree.filter(function(item, index, array) {
            return item.data.name.substr(0,filterString.length).toLowerCase() == filterString.toLowerCase();
            }) 
        );
    }


onTestingMouseDown(event: MouseEvent,i: number) {
    console.log('click event',event.toElement.textContent.trim())
    // console.log(event);
    // console.log(event.toElement.textContent)
    // console.log(i);

    let int: number = 0;
    if (event.toElement.textContent.trim() == 'A') {int =0}
    if (event.toElement.textContent.trim() == 'B') {int =1}
    if (event.toElement.textContent.trim() == 'C') {int =2}
    if (event.toElement.textContent.trim() == 'D') {int =3}

    if (this.testingShow == false) {


        this.renderer.setElementStyle(this.childrenTesting.toArray()[int].nativeElement, 
            'border', '1px solid darkgray');
        this.renderer.setElementStyle(this.childrenTesting.toArray()[int].nativeElement, 
            'box-shadow', '2px 2px 12px black');
        this.renderer.setElementStyle(this.childrenTesting.toArray()[int].nativeElement, 
            'background-color', barChartContainerColor2);

        this.testing.push('D');

        // this.testingShow = true;
        var view = new vg.View(vg.parse(spec));
        view.renderer('svg')
            .initialize( this.childrenTesting.toArray()[int].nativeElement)
            .hover()
            .run(); 
    }
}

onTestingDragStart(event: DragEvent,i: number) {
    console.log('drag start')
    // console.log(event);
    // console.log(event.toElement.textContent)
    // console.log(i);
    this.testingX = event.x;
    this.testingY = event.y;
}

onTestingDragEnd(event: DragEvent,i: number) {
    console.log('drag end')
    // console.log(event);
    // console.log(event.toElement.textContent)
    // console.log(i);
    console.log ('from',this.testingX,this.testingY);
    console.log ('to',event.x,event.y);
    //    var view = new vg.View(vg.parse(spec));
    //    view.renderer('svg')
    //         .initialize(this.elTesting.nativeElement)
    //         .hover()
    //         .run();

    //    var view = new vg.View(vg.parse(spec));
    //    view.renderer('svg')
    //         .initialize( this.childrenTesting.toArray()[i].nativeElement)
    //         .hover()
    //         .run();
            
   
//  currentBarChart = 'barChart1';
//                 if (event.clientX >=250) {
//                     this.barChartLeft1 = event.clientX;
//                 }
//                 if (event.clientY >=72) {
//                     this.barChartTop1 = event.clientY / 16;
//                 }
//                 this.showBarChart1 = true;   
//                 let VegaLiteBarChartInstance1 = new VegaLiteBarChart1 (
//                     this.elementvegaBarChart1, this.renderer);
//                 VegaLiteBarChartInstance1.barChart();    
}

    onDashboardDelete() {
console.log    ('cancel');        
    }

    onDashboardAdd() {
console.log    ('cancel');        
    }

    onTabChange(evt) {
        console.log('Tab changed to ' +  evt.index);
    }

    ondragStartLineChart(event) {
        // Start of dragging LineChart
        console.log('LineChart start');
        this.lineChartIsVisible = false;
    }
    
    ondragEndLineChart(event) {
        // End of dragging LineChart
        console.log('LineChart end');
        this.lineChartIsVisible=true;
    }

    ondragStartPieChart(event) {
        // Start of dragging PieChart
        console.log('PieChart start');
        this.pieChartIsVisible = false;
    }
    
    ondragEndPieChart(event) {
        // End of dragging PieChart
        console.log('PieChart end');
        this.pieChartIsVisible=true;
    }

    ondragStartBarChart(event) {
        // Start of dragging BarChart
        console.log('BarChart start');
    }
    
    ondragEndBarChart(event) {
        // End of dragging BarChart
        console.log('BarChart end');
this.barChartLeft1 = this.barChartLeft1 + 1;

        if (nrBarChartsShown >= 2) {
console.log (this.showBarChart1);
            this.showBarChart1 = true;
            this.showBarChart2 = true;
            alert('For now, we only show 2 bar charts ...')
        } else {

            nrBarChartsShown = nrBarChartsShown + 1;

            if (nrBarChartsShown == 1) {
                currentBarChart = 'barChart1';
                if (event.clientX >=250) {
                    this.barChartLeft1 = event.clientX;
                }
                if (event.clientY >=72) {
                    this.barChartTop1 = event.clientY / 16;
                }
                this.showBarChart1 = true;   
                let VegaLiteBarChartInstance1 = new VegaLiteBarChart1 (
                    this.elementvegaBarChart1, this.renderer);
                VegaLiteBarChartInstance1.barChart();
            } else if (nrBarChartsShown = 2) {
                currentBarChart = 'barChart2';
                if (event.clientX >=250) {
                    this.barChartLeft2 = event.clientX;
                }
                if (event.clientY >=72) {
                    this.barChartTop2 = event.clientY / 16;
                }
                this.showBarChart2 = true;   
                let VegaLiteBarChartInstance2 = new VegaLiteBarChart2 (
                    this.elementvegaBarChart2, this.renderer);
                VegaLiteBarChartInstance2.barChart();
            }
        }
     }
    
    mousedownVegaBarChart1(ev) {
        // Mouse went down on vega BarChart
        currentBarChart = 'barChart1';
        console.log('Mouse went down on :' + currentBarChart)
        this.showPalette = true;
    }
    
    mousedownVegaBarChart2(ev) {
        // Mouse went down on vega BarChart
        currentBarChart = 'barChart2';
        console.log('Mouse went down on :' + currentBarChart)
        this.showPalette = true;
    }

    onOpenPaletteTab($event) {
        // Palette tab has been opened 
        console.log('onOpenPaletteTab')    

    }

    onChangeChartWidth(ev) {
        // Dynamically changes BarChart width
console.log ('slide currentBarChart');
        barChartWidth1 = this.chartWidth;
        barChartWidth2 = this.chartWidth;
        if (currentBarChart == 'barChart1') {
            let VegaLiteBarChartInstance1 = new VegaLiteBarChart1(  
                        this.elementvegaBarChart1, this.renderer);
            VegaLiteBarChartInstance1.barChart ();
        }
        if (currentBarChart == 'barChart2') {
            let VegaLiteBarChartInstance2 = new VegaLiteBarChart2(  
                        this.elementvegaBarChart2, this.renderer);
            VegaLiteBarChartInstance2.barChart ();
        }
    }
 
    clickPaletteHide() {
        // Hides palette (on right)
        this.showPalette = false;
    }

    clickPaletteApply() {
        // Applies the changes from the palette
        if (this.selectedBackgroundColor) {

            if (currentBarChart == 'barChart1') {
                let changeElementAttributesInstance1 = new changeElementAttributes(  
                    this.renderer, this.elementvegaBarChart1);  // elementinputBoxTest
                barChartContainerColor1 = this.selectedBackgroundColor['name'];
                changeElementAttributesInstance1.changeAttribute('style', 
                    'background-color:' + barChartContainerColor1 + ';');
                // Seems we need to touch this, else it jumps to the left ...
                this.barChartLeft1 = this.barChartLeft1 + 1;
            } else {    
                let changeElementAttributesInstance2 = new changeElementAttributes(  
                    this.renderer, this.elementvegaBarChart2);  // elementinputBoxTest
                barChartContainerColor2 = this.selectedBackgroundColor['name'];
                changeElementAttributesInstance2.changeAttribute('style', 
                    'background-color:' + barChartContainerColor2 + ';');
                // Seems we need to touch this, else it jumps to the left ...
                this.barChartLeft2 = this.barChartLeft2 + 1;
            }
        }
    }

    onClosePaletteTab($event) {
        // Palette tab has been closed
        console.log('onClosePaletteTab')    
    }
    

    clickRadioButtonScale() {
console.log('Selected: ' + this.radioLabelval1)
    }

    handleChangeScale (e) {
        this.checkedScale = e.checked;

        // if (this.checkedScale) {showMonths = t}
console.log('State is: ' + this.checkedScale)
    }

    onDragStartVegaBarChart1(evt) {
        // Start dragging Vega BarChart - catch mouse position
        this.mouseDownX1 = evt.clientX;
        this.mouseDownY1 = evt.clientY;
    }

    onDragStartVegaBarChart2(evt) {
        // Start dragging Vega BarChart - catch mouse position
        this.mouseDownX2 = evt.clientX;
        this.mouseDownY2 = evt.clientY;
    }

    onDragEndVegaBarChart1(ev, mouseX, mouseY) {
console.log(ev)
        // End of dragging Vega BarChart
        this.barChartLeft1 = this.barChartLeft1 + (ev.clientX - this.mouseDownX1);
        this.barChartTop1 = this.barChartTop1 + (ev.clientY - this.mouseDownY1) / 16 ;
    }

    onDragEndVegaBarChart2(ev, mouseX, mouseY) {
console.log(ev)
        // End of dragging Vega BarChart
        this.barChartLeft2 = this.barChartLeft2 + (ev.clientX - this.mouseDownX2);
        this.barChartTop2 = this.barChartTop2 + (ev.clientY - this.mouseDownY2) / 16 ;
    }



    onNodeSelect(event) {
        this.globalFunctionService.printToConsole(this.constructor.name,'onNodeSelect', '@Start');
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Selected Node', 
            detail:   event.node.data.name
        });

    }

    onNodeUnselect(event) {
        this.globalFunctionService.printToConsole(this.constructor.name,'onNodeUnselect', '@Start');
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Selected Node', 
            detail:   event.node.data.name
        });
    }
       
    nodeExpand(event) {
        this.globalFunctionService.printToConsole(this.constructor.name,'nodeExpand', '@Start');
        // if(event.node) {
        //     //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
        //     this.nodeService.getLazyFilesystem().then(nodes => event.node.children = nodes);
        // }
    }
    
    viewNode(node: TreeNode) {
        this.globalFunctionService.printToConsole(this.constructor.name,'viewNode', '@Start');
    }

    deleteNode(node: TreeNode) {
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteNode', '@Start');
    }

}


// @Directive({
//   selector: '[exploreRenderer]'
// })
// export class ExploreRendererDirective {
//   private nativeElement : Node;
//   constructor( private renderer : Renderer, private element : ElementRef ) {
//     this.nativeElement = element.nativeElement;
//   }

//   changeValue (xCoordinate: number, yCoordinate: number) {

// Create new elements
        // let inputElement = this.renderer.createElement(this.nativeElement, 'input');
        // this.renderer.setElementAttribute(inputElement, 'value', 'Hello from renderer');
        // this.renderer.invokeElementMethod(inputElement, 'focus', []);
        // this.renderer.setElementAttribute(inputElement, 'style',
        //     'background-color:powderblue;width:320px;');

        // let buttonElement = this.renderer.createElement(this.nativeElement, 'button');
        // this.renderer.createText(buttonElement, 'Click me!');
        // this.renderer.setElementStyle(buttonElement, 'backgroundColor', 'yellow');
        // this.renderer.listen(buttonElement, 'click', ( event ) => console.log(event));

        // this.renderer.setElementAttribute(this.element, 'value', 'jam')

// input box   
    // console.log(this.element.nativeElement)
    // console.log('off height---' + this.element.nativeElement.offsetHeight);  //<<<===here
    // console.log('off width---' + this.element.nativeElement.offsetWidth);    //<<<===here
    // console.log('placeholder---' + this.element.nativeElement.placeholder);  //<<<===here
    // console.log('value---' + this.element.nativeElement.value);    //<<<===here
    // console.log( this.element.nativeElement.style);    //<<<===here
    // console.log( this.element.nativeElement.style['backgroundColor']);    //<<<===here

    // this.renderer.setElementAttribute(this.element.nativeElement, 
    //     'style', 'background-color:blue;width:400px;');

    //  if (this.element.nativeElement.hasAttributes()) {
    //    var attrs = this.element.nativeElement.attributes;
    //    var output = "";
    //    for(var i = attrs.length - 1; i >= 0; i--) {
    //      output += attrs[i].name + "->" + attrs[i].value;
    //    }
    //    console.log(output);
    //  } else {
    //    console.log("No attributes to show");
    //  }
        // this.renderer.setElementAttribute(this.element.nativeElement, 'placeholder', 'Hello from renderer');
        // this.renderer.setElementAttribute(this.element.nativeElement, 'visible', 'false');


// Vega div
    // console.log('off height---' + this.element.nativeElement.offsetHeight);  //<<<===here
    // console.log('off width---' + this.element.nativeElement.offsetWidth);    //<<<===here
    // console.log( this.element.nativeElement.style);    //<<<===here
    // console.log( this.element.nativeElement.style['backgroundColor']);    //<<<===here

    // this.renderer.setElementAttribute(this.element.nativeElement, 
    //     'style', 'background-color:blue;width:100px;');

    // this.renderer.setElementProperty(this.element.nativeElement, 
    //     'left', '400px');
    // console.log('in ExploreRendererDirective')


    //  if (this.element.nativeElement.hasAttributes()) {
    //    var attrs = this.element.nativeElement.attributes;
    //    var output = "";
    //    for(var i = attrs.length - 1; i >= 0; i--) {
    //      output += attrs[i].name + "->" + attrs[i].value;
    //    }
    //    console.log(output);
    //  } else {
    //    console.log("No attributes to show");
    //  }
        // this.renderer.setElementAttribute(this.element.nativeElement, 'placeholder', 'Hello from renderer');
        // this.renderer.setElementAttribute(this.element.nativeElement, 'visible', 'false');


//   }
// }

export class BarCharBuilder {
    // Almost build the spec for the BarChart
    constructor () {}
    
    barChartSpec (xwidth: number) {
        let specTS = spec;
        if (currentBarChart == 'barChart1') {
            specTS['width'] = barChartWidth1;
            specTS['data'] = [
                                {
                                "name": "table",
                                "values": [
                                    {"category": "A", "amount": 28},
                                    {"category": "B", "amount": 55},
                                    {"category": "C", "amount": 43},
                                    {"category": "D", "amount": 91},
                                    {"category": "E", "amount": 81},
                                    {"category": "F", "amount": 53},
                                    {"category": "G", "amount": 19},
                                    {"category": "H", "amount": 87}
                                ]
                                }
                            ];
            specTS['marks'][0].encode.update['fill']['value'] = 'steelblue';
        }
        if (currentBarChart == 'barChart2') {
            specTS['width'] = barChartWidth2;
            specTS['data'] = [
                                {
                                "name": "table",
                                "values": [
                                    {"category": "Merc", "amount": 208},
                                    {"category": "Hundai", "amount": 155},
                                    {"category": "VW", "amount": 438},
                                    {"category": "KIA", "amount": 91},
                                    {"category": "Toyota", "amount": 681},
                                    {"category": "Ford", "amount": 523},
                                ]
                                }
                            ];
            
            specTS['marks'][0].encode.update['fill']['value'] = 'bisque';
        }

console.log(spec['marks']);
        return specTS  ;
    }
}

@Directive({ selector: '[vegaBarChart1]' })
export class VegaLiteBarChart1 {
    constructor(private elem: ElementRef, private renderer: Renderer) {
// barChartLeft1 = barChartLeft1 + 1;
// console.log(barChartWidth1)
        if (nrBarChartsShown >= 1) {
            this.barChart();
            // renderer.setElementStyle(elem.nativeElement, 
            //     'border', '1px solid darkgray');
            // renderer.setElementStyle(elem.nativeElement, 
            //     'box-shadow', '2px 2px 12px black');
            // renderer.setElementStyle(elem.nativeElement, 
            //     'background-color', barChartContainerColor1);
            //     barChartLeft1 = barChartLeft1 + 1;

            // renderer.setElementAttribute(this.elem.nativeElement,
            //     'style','position:absolute'); 
            // renderer.setElementAttribute(this.elem.nativeElement,
            //     'style','left:100px'); 
            // renderer.setElementStyle(elem.nativeElement, 
            //     'height', '200px');
            // renderer.setElementStyle(elem.nativeElement, 
            //     'width', '250px');
            
            // renderer.setElementStyle(this.elem.nativeElement, 
            //     'border', '1px solid darkgray');
            // renderer.setElementStyle(this.elem.nativeElement, 
            //     'box-shadow', '2px 2px 12px black');


console.log('@dir1 constr ' + currentBarChart);
console.log(nrBarChartsShown);
        }    
}
    barChart() {

        // Redraws BarChart
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'border', '1px solid darkgray');
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'box-shadow', '2px 2px 12px black');
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'background-color', barChartContainerColor1);

console.log('@dir1 barChart ' + currentBarChart);

        // let specTS = spec;
        // specTS['width'] = xwidth;
        let BarCharBuilderInstance = new BarCharBuilder();
        let specTS = BarCharBuilderInstance.barChartSpec(400);

       var view = new vg.View(vg.parse(specTS));
       view.renderer('svg')
            .initialize(this.elem.nativeElement)
            .hover()
            .run();
    }
}

@Directive({ selector: '[vegaBarChart2]' })
export class VegaLiteBarChart2 {
    constructor(private elem: ElementRef, private renderer: Renderer) {
                if (nrBarChartsShown >= 2) {
            this.barChart();
                }
console.log('@dir2 constr ' + currentBarChart);
    }
    barChart() {
        // Redraws BarChart
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'border', '1px solid darkgray');
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'box-shadow', '2px 2px 12px black');
        this.renderer.setElementStyle(this.elem.nativeElement, 
            'background-color', barChartContainerColor2);


console.log('@dir2 barChart ' + currentBarChart);

        let BarCharBuilderInstance = new BarCharBuilder();
        let specTS = BarCharBuilderInstance.barChartSpec(400);

       var view = new vg.View(vg.parse(specTS));
       view.renderer('svg')
            .initialize(this.elem.nativeElement)
            .hover()
            .run();
    }
}

export class changeElementAttributes {
    constructor (private renderer : Renderer, private element : ElementRef ) {}

    changeAttribute(attributeToChange: string, newValue: string) {
        // this.renderer.setElementAttribute(this.element.nativeElement,'style','position:absolute'); 
        // this.renderer.setElementAttribute(this.element.nativeElement,'style','left:100px'); 
            
        this.renderer.setElementAttribute(this.element.nativeElement, 
            // 'style', 'background-color:blue;width:400px;');
            attributeToChange, newValue);
        this.renderer.setElementStyle(this.element.nativeElement, 'border', '1px solid darkgray');
        this.renderer.setElementStyle(this.element.nativeElement, 'box-shadow', '2px 2px 12px black');
        this.renderer.setElementStyle(this.element.nativeElement, 'background-color', newValue);
    }
}