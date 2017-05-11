// Defines colors used in Canvas (using W3 names)

//  PrimeNG stuffies
import { Injectable }                 from '@angular/core';

// PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';  

export class ColorValue {
    label: string;
    value: {
        id: string;
        name: string;
        code: string;
    }
}

@Injectable()
export class CanvasColors {

    colors: SelectItem[];
    
    constructor() {

        // NB - these things are case SensitivE - so use lower case for all field values
        this.colors = [
            {label:'transparent',            value:{id:'transparent',           name: 'transparent',           code: 'transparent'}},
            {label:'aliceblue',              value:{id:'aliceblue',             name: 'aliceblue',             code: '#F0F8FF'}},
            {label:'antiquewhite',           value:{id:'antiquewhite',          name: 'antiquewhite',          code: '#FAEBD7'}},
            {label:'aqua',                   value:{id:'aqua',                  name: 'aqua',                  code: '#00FFFF'}},
            {label:'aquamarine',             value:{id:'aquamarine',            name: 'aquamarine',            code: '#7FFFD4'}},
            {label:'azure',                  value:{id:'azure',                 name: 'azure',                 code: '#F0FFFF'}},
            {label:'beige',                  value:{id:'beige',                 name: 'beige',                 code: '#F5F5DC'}},
            {label:'bisque',                 value:{id:'bisque',                name: 'bisque',                code: '#FFE4C4'}},
            {label:'black',                  value:{id:'black',                 name: 'black',                 code: '#000000'}},
            {label:'blanchedalmond',         value:{id:'blanchedalmond',        name: 'blanchedalmond',        code: '#FFEBCD'}},
            {label:'blue',                   value:{id:'blue',                  name: 'blue',                  code: '#0000FF'}},
            {label:'blueviolet',             value:{id:'blueviolet',            name: 'blueviolet',            code: '#8A2BE2'}},
            {label:'brown',                  value:{id:'brown',                 name: 'brown',                 code: '#A52A2A'}},
            {label:'burlywood',              value:{id:'burlywood',             name: 'burlywood',             code: '#DEB887'}},
            {label:'cadetblue',              value:{id:'cadetblue',             name: 'cadetblue',             code: '#5F9EA0'}},
            {label:'chartreuse',             value:{id:'chartreuse',            name: 'chartreuse',            code: '#7FFF00'}},
            {label:'chocolate',              value:{id:'chocolate',             name: 'chocolate',             code: '#D2691E'}},
            {label:'coral',                  value:{id:'coral',                 name: 'coral',                 code: '#FF7F50'}},
            {label:'cornflowerblue',         value:{id:'cornflowerblue',        name: 'cornflowerblue',        code: '#6495ED'}},
            {label:'cornsilk',               value:{id:'cornsilk',              name: 'cornsilk',              code: '#FFF8DC'}},
            {label:'crimson',                value:{id:'crimson',               name: 'crimson',               code: '#DC143C'}},
            {label:'cyan',                   value:{id:'cyan',                  name: 'cyan',                  code: '#00FFFF'}},
            {label:'darkblue',               value:{id:'darkblue',              name: 'darkblue',              code: '#00008B'}},
            {label:'darkcyan',               value:{id:'darkcyan',              name: 'darkcyan',              code: '#008B8B'}},
            {label:'darkgoldenrod',          value:{id:'darkgoldenrod',         name: 'darkgoldenrod',         code: '#B8860B'}},
            {label:'darkgray',               value:{id:'darkgray',              name: 'darkgray',              code: '#A9A9A9'}},
            {label:'darkgrey',               value:{id:'darkgrey',              name: 'darkgrey',              code: '#A9A9A9'}},
            {label:'darkgreen',              value:{id:'darkgreen',             name: 'darkgreen',             code: '#006400'}},
            {label:'darkkhaki',              value:{id:'darkkhaki',             name: 'darkkhaki',             code: '#BDB76B'}},
            {label:'darkmagenta',            value:{id:'darkmagenta',           name: 'darkmagenta',           code: '#8B008B'}},
            {label:'darkolivegreen',         value:{id:'darkolivegreen',        name: 'darkolivegreen',        code: '#556B2F'}},
            {label:'darkorange',             value:{id:'darkorange',            name: 'darkorange',            code: '#FF8C00'}},
            {label:'darkorchid',             value:{id:'darkorchid',            name: 'darkorchid',            code: '#9932CC'}},
            {label:'darkred',                value:{id:'darkred',               name: 'darkred',               code: '#8B0000'}},
            {label:'darksalmon',             value:{id:'darksalmon',            name: 'darksalmon',            code: '#E9967A'}},
            {label:'darkseagreen',           value:{id:'darkseagreen',          name: 'darkseagreen',          code: '#8FBC8F'}},
            {label:'darkslateblue',          value:{id:'darkslateblue',         name: 'darkslateblue',         code: '#483D8B'}},
            {label:'darkslategray',          value:{id:'darkslategray',         name: 'darkslategray',         code: '#2F4F4F'}},
            {label:'darkslategrey',          value:{id:'darkslategrey',         name: 'darkslategrey',         code: '#2F4F4F'}},
            {label:'darkturquoise',          value:{id:'darkturquoise',         name: 'darkturquoise',         code: '#00CED1'}},
            {label:'darkviolet',             value:{id:'darkviolet',            name: 'darkviolet',            code: '#9400D3'}},
            {label:'deeppink',               value:{id:'deeppink',              name: 'deeppink',              code: '#FF1493'}},
            {label:'deepskyblue',            value:{id:'deepskyblue',           name: 'deepskyblue',           code: '#00BFFF'}},
            {label:'dimgray',                value:{id:'dimgray',               name: 'dimgray',               code: '#696969'}},
            {label:'dimgrey',                value:{id:'dimgrey',               name: 'dimgrey',               code: '#696969'}},
            {label:'dodgerblue',             value:{id:'dodgerblue',            name: 'dodgerblue',            code: '#1E90FF'}},
            {label:'firebrick',              value:{id:'firebrick',             name: 'firebrick',             code: '#B22222'}},
            {label:'floralwhite',            value:{id:'floralwhite',           name: 'floralwhite',           code: '#FFFAF0'}},
            {label:'forestgreen',            value:{id:'forestgreen',           name: 'forestgreen',           code: '#228B22'}},
            {label:'fuchsia',                value:{id:'fuchsia',               name: 'fuchsia',               code: '#FF00FF'}},
            {label:'gainsboro',              value:{id:'gainsboro',             name: 'gainsboro',             code: '#DCDCDC'}},
            {label:'ghostwhite',             value:{id:'ghostwhite',            name: 'ghostwhite',            code: '#F8F8FF'}},
            {label:'gold',                   value:{id:'gold',                  name: 'gold',                  code: '#FFD700'}},
            {label:'goldenrod',              value:{id:'goldenrod',             name: 'goldenrod',             code: '#DAA520'}},
            {label:'gray',                   value:{id:'gray',                  name: 'gray',                  code: '#808080'}},
            {label:'grey',                   value:{id:'grey',                  name: 'grey',                  code: '#808080'}},
            {label:'green',                  value:{id:'green',                 name: 'green',                 code: '#008000'}},
            {label:'greenyellow',            value:{id:'greenyellow',           name: 'greenyellow',           code: '#ADFF2F'}},
            {label:'honeydew',               value:{id:'honeydew',              name: 'honeydew',              code: '#F0FFF0'}},
            {label:'hotpink',                value:{id:'hotpink',               name: 'hotpink',               code: '#FF69B4'}},
            {label:'indianred',              value:{id:'indianred',             name: 'indianred',             code: '#CD5C5C'}},
            {label:'indigo',                 value:{id:'indigo',                name: 'indigo',                code: '#4B0082'}},
            {label:'ivory',                  value:{id:'ivory',                 name: 'ivory',                 code: '#FFFFF0'}},
            {label:'khaki',                  value:{id:'khaki',                 name: 'khaki',                 code: '#F0E68C'}},
            {label:'lavender',               value:{id:'lavender',              name: 'lavender',              code: '#E6E6FA'}},
            {label:'lavenderblush',          value:{id:'lavenderblush',         name: 'lavenderblush',         code: '#FFF0F5'}},
            {label:'lawngreen',              value:{id:'lawngreen',             name: 'lawngreen',             code: '#7CFC00'}},
            {label:'lemonchiffon',           value:{id:'lemonchiffon',          name: 'lemonchiffon',          code: '#FFFACD'}},
            {label:'lightblue',              value:{id:'lightblue',             name: 'lightblue',             code: '#ADD8E6'}},
            {label:'lightcoral',             value:{id:'lightcoral',            name: 'lightcoral',            code: '#F08080'}},
            {label:'lightcyan',              value:{id:'lightcyan',             name: 'lightcyan',             code: '#E0FFFF'}},
            {label:'lightgoldenrodyellow',   value:{id:'lightgoldenrodyellow',  name: 'lightgoldenrodyellow',  code: '#FAFAD2'}},
            {label:'lightgray',              value:{id:'lightgray',             name: 'lightgray',             code: '#D3D3D3'}},
            {label:'lightgrey',              value:{id:'lightgrey',             name: 'lightgrey',             code: '#D3D3D3'}},
            {label:'lightgreen',             value:{id:'lightgreen',            name: 'lightgreen',            code: '#90EE90'}},
            {label:'lightpink',              value:{id:'lightpink',             name: 'lightpink',             code: '#FFB6C1'}},
            {label:'lightsalmon',            value:{id:'lightsalmon',           name: 'lightsalmon',           code: '#FFA07A'}},
            {label:'lightseagreen',          value:{id:'lightseagreen',         name: 'lightseagreen',         code: '#20B2AA'}},
            {label:'lightskyblue',           value:{id:'lightskyblue',          name: 'lightskyblue',          code: '#87CEFA'}},
            {label:'lightslategray',         value:{id:'lightslategray',        name: 'lightslategray',        code: '#778899'}},
            {label:'lightslategrey',         value:{id:'lightslategrey',        name: 'lightslategrey',        code: '#778899'}},
            {label:'lightsteelblue',         value:{id:'lightsteelblue',        name: 'lightsteelblue',        code: '#B0C4DE'}},
            {label:'lightyellow',            value:{id:'lightyellow',           name: 'lightyellow',           code: '#FFFFE0'}},
            {label:'lime',                   value:{id:'lime',                  name: 'lime',                  code: '#00FF00'}},
            {label:'limegreen',              value:{id:'limegreen',             name: 'limegreen',             code: '#32CD32'}},
            {label:'linen',                  value:{id:'linen',                 name: 'linen',                 code: '#FAF0E6'}},
            {label:'magenta',                value:{id:'magenta',               name: 'magenta',               code: '#FF00FF'}},
            {label:'maroon',                 value:{id:'maroon',                name: 'maroon',                code: '#800000'}},
            {label:'mediumaquamarine',       value:{id:'mediumaquamarine',      name: 'mediumaquamarine',      code: '#66CDAA'}},
            {label:'mediumblue',             value:{id:'mediumblue',            name: 'mediumblue',            code: '#0000CD'}},
            {label:'mediumorchid',           value:{id:'mediumorchid',          name: 'mediumorchid',          code: '#BA55D3'}},
            {label:'mediumpurple',           value:{id:'mediumpurple',          name: 'mediumpurple',          code: '#9370DB'}},
            {label:'mediumseagreen',         value:{id:'mediumseagreen',        name: 'mediumseagreen',        code: '#3CB371'}},
            {label:'mediumslateblue',        value:{id:'mediumslateblue',       name: 'mediumslateblue',       code: '#7B68EE'}},
            {label:'mediumspringgreen',      value:{id:'mediumspringgreen',     name: 'mediumspringgreen',     code: '#00FA9A'}},
            {label:'mediumturquoise',        value:{id:'mediumturquoise',       name: 'mediumturquoise',       code: '#48D1CC'}},
            {label:'mediumvioletred',        value:{id:'mediumvioletred',       name: 'mediumvioletred',       code: '#C71585'}},
            {label:'midnightblue',           value:{id:'midnightblue',          name: 'midnightblue',          code: '#191970'}},
            {label:'mintcream',              value:{id:'mintcream',             name: 'mintcream',             code: '#F5FFFA'}},
            {label:'mistyrose',              value:{id:'mistyrose',             name: 'mistyrose',             code: '#FFE4E1'}},
            {label:'moccasin',               value:{id:'moccasin',              name: 'moccasin',              code: '#FFE4B5'}},
            {label:'navajowhite',            value:{id:'navajowhite',           name: 'navajowhite',           code: '#FFDEAD'}},
            {label:'navy',                   value:{id:'navy',                  name: 'navy',                  code: '#000080'}},
            {label:'oldlace',                value:{id:'oldlace',               name: 'oldlace',               code: '#FDF5E6'}},
            {label:'olive',                  value:{id:'olive',                 name: 'olive',                 code: '#808000'}},
            {label:'olivedrab',              value:{id:'olivedrab',             name: 'olivedrab',             code: '#6B8E23'}},
            {label:'orange',                 value:{id:'orange',                name: 'orange',                code: '#FFA500'}},
            {label:'orangered',              value:{id:'orangered',             name: 'orangered',             code: '#FF4500'}},
            {label:'orchid',                 value:{id:'orchid',                name: 'orchid',                code: '#DA70D6'}},
            {label:'palegoldenrod',          value:{id:'palegoldenrod',         name: 'palegoldenrod',         code: '#EEE8AA'}},
            {label:'palegreen',              value:{id:'palegreen',             name: 'palegreen',             code: '#98FB98'}},
            {label:'paleturquoise',          value:{id:'paleturquoise',         name: 'paleturquoise',         code: '#AFEEEE'}},
            {label:'palevioletred',          value:{id:'palevioletred',         name: 'palevioletred',         code: '#DB7093'}},
            {label:'papayawhip',             value:{id:'papayawhip',            name: 'papayawhip',            code: '#FFEFD5'}},
            {label:'peachpuff',              value:{id:'peachpuff',             name: 'peachpuff',             code: '#FFDAB9'}},
            {label:'peru',                   value:{id:'peru',                  name: 'peru',                  code: '#CD853F'}},
            {label:'pink',                   value:{id:'pink',                  name: 'pink',                  code: '#FFC0CB'}},
            {label:'plum',                   value:{id:'plum',                  name: 'plum',                  code: '#DDA0DD'}},
            {label:'powderblue',             value:{id:'powderblue',            name: 'powderblue',            code: '#B0E0E6'}},
            {label:'purple',                 value:{id:'purple',                name: 'purple',                code: '#800080'}},
            {label:'rebeccapurple',          value:{id:'rebeccapurple',         name: 'rebeccapurple',         code: '#663399'}},
            {label:'red',                    value:{id:'red',                   name: 'red',                   code: '#FF0000'}},
            {label:'rosybrown',              value:{id:'rosybrown',             name: 'rosybrown',             code: '#BC8F8F'}},
            {label:'royalblue',              value:{id:'royalblue',             name: 'royalblue',             code: '#4169E1'}},
            {label:'saddlebrown',            value:{id:'saddlebrown',           name: 'saddlebrown',           code: '#8B4513'}},
            {label:'salmon',                 value:{id:'salmon',                name: 'salmon',                code: '#FA8072'}},
            {label:'sandybrown',             value:{id:'sandybrown',            name: 'sandybrown',            code: '#F4A460'}},
            {label:'seagreen',               value:{id:'seagreen',              name: 'seagreen',              code: '#2E8B57'}},
            {label:'seashell',               value:{id:'seashell',              name: 'seashell',              code: '#FFF5EE'}},
            {label:'sienna',                 value:{id:'sienna',                name: 'sienna',                code: '#A0522D'}},
            {label:'silver',                 value:{id:'silver',                name: 'silver',                code: '#C0C0C0'}},
            {label:'skyblue',                value:{id:'skyblue',               name: 'skyblue',               code: '#87CEEB'}},
            {label:'slateblue',              value:{id:'slateblue',             name: 'slateblue',             code: '#6A5ACD'}},
            {label:'slategray',              value:{id:'slategray',             name: 'slategray',             code: '#708090'}},
            {label:'slategrey',              value:{id:'slategrey',             name: 'slategrey',             code: '#708090'}},
            {label:'snow',                   value:{id:'snow',                  name: 'snow',                  code: '#FFFAFA'}},
            {label:'springgreen',            value:{id:'springgreen',           name: 'springgreen',           code: '#00FF7F'}},
            {label:'steelblue',              value:{id:'steelblue',             name: 'steelblue',             code: '#4682B4'}},
            {label:'tan',                    value:{id:'tan',                   name: 'tan',                   code: '#D2B48C'}},
            {label:'teal',                   value:{id:'teal',                  name: 'teal',                  code: '#008080'}},
            {label:'thistle',                value:{id:'thistle',               name: 'thistle',               code: '#D8BFD8'}},
            {label:'tomato',                 value:{id:'tomato',                name: 'tomato',                code: '#FF6347'}},
            {label:'turquoise',              value:{id:'turquoise',             name: 'turquoise',             code: '#40E0D0'}},
            {label:'violet',                 value:{id:'violet',                name: 'violet',                code: '#EE82EE'}},
            {label:'wheat',                  value:{id:'wheat',                 name: 'wheat',                 code: '#F5DEB3'}},
            {label:'white',                  value:{id:'white',                 name: 'white',                 code: '#FFFFFF'}},
            {label:'whitesmoke',             value:{id:'whitesmoke',            name: 'whitesmoke',            code: '#F5F5F5'}},
            {label:'yellow',                 value:{id:'yellow',                name: 'yellow',                code: '#FFFF00'}},
            {label:'yellowgreen',            value:{id:'yellowgreen',           name: 'yellowgreen',           code: '#9ACD32'}}
        ];
    }

    getColors(): SelectItem[] {
        return this.colors;
    }

    hexCodeOfColor(colorCode: string): string {
        // This function returns the hex code of a given color as a string, ie lightgray
        let singleColor: ColorValue = this.colors.filter(col => col.label == colorCode)[0];

        if (singleColor == null) {
            return '';
        } else {
            return singleColor.value.code;
        }
    }
}