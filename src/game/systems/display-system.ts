import System from "../../core/system";
import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import GlyphComponent from "../components/glyph-component";
import PositionCompoent from "../components/position-component";

export default class DisplaySystem extends System {
    private display: Display;
    private smartEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.smartEntities = new SmartEntitiesContainer(engine, [
            GlyphComponent, PositionCompoent
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        for (let entity of this.smartEntities.getEnties()) {
            let position = entity.get(PositionCompoent);
            let glyph = entity.get(GlyphComponent);
            this.display.draw(position.x, position.y, glyph.symbol, glyph.fgColor, glyph.bgColor);
        }
    }
}
