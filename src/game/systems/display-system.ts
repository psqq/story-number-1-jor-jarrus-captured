import System from "../../core/system";
import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import GlyphComponent from "../components/glyph-component";
import PositionCompoent from "../components/position-component";
import FovComponent from "../components/fov-component";

export default class DisplaySystem extends System {
    private display: Display;
    private drawableEntities: SmartEntitiesContainer;
    private fovEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.drawableEntities = new SmartEntitiesContainer(engine, [
            GlyphComponent, PositionCompoent
        ]);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent,
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        const fov = this.fovEntities.getEnties()[0].get(FovComponent).fov;
        for (let entity of this.drawableEntities.getEnties()) {
            const position = entity.get(PositionCompoent);
            if (!fov[position.x][position.y]) {
                continue;
            }
            const glyph = entity.get(GlyphComponent);
            this.display.draw(position.x, position.y, glyph.symbol, glyph.fgColor, glyph.bgColor);
        }
    }
}
