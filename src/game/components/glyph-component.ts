import Component from "../../core/component";
import config from '../../config';

export default class GlyphComponent extends Component {
    symbol: string = '?';
    fgColor: string = config.map.fgColor;
    bgColor: string = config.map.bgColor;
    constructor() {
        super();
    }
    setSymbol(symbol: string) {
        this.symbol = symbol;
        return this;
    }
    setFgColor(fgColor: string) {
        this.fgColor = fgColor;
        return this;
    }
    setBgColor(bgColor: string) {
        this.bgColor = bgColor;
        return this;
    }
}
