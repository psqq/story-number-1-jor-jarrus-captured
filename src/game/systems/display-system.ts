import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import GlyphComponent from "../components/glyph-component";
import PositionCompoent from "../components/position-component";
import FovComponent from "../components/fov-component";
import coreConfig from "../../core/core-config";
import BaseSystem from "./base-system";
import Victor = require("victor");
import config from "../../config";

export default class DisplaySystem extends BaseSystem {
    private display: Display;
    private drawableEntities: SmartEntitiesContainer;
    private fovEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.drawableEntities = new SmartEntitiesContainer(engine, [
            GlyphComponent, PositionCompoent
        ]);
        this.drawableEntities.on(
            coreConfig.smartEntitiesContainerEvents.changed,
            () => {
                this.drawableEntities.getEnties().sort((a, b) => {
                    return a.get(GlyphComponent).zLevel - b.get(GlyphComponent).zLevel;
                })
            }
        );
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent,
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        let fov = this.getPlayerFov().fov;
        let memorizedFovArea = this.getPlayerMemorizedFovArea().memorizedFovArea;
        const deep = this.getCurrentDeep();
        for (let entity of this.drawableEntities.getEnties()) {
            const position = entity.get(PositionCompoent);
            if (position.deep != deep) {
                continue;
            }
            const x = position.x;
            const y = position.y;
            let memorized = false;
            if (!(fov[x][y] || memorizedFovArea[x][y])) {
                continue;
            }
            if (!fov[x][y]) {
                memorized = true;
            }
            const glyph = entity.get(GlyphComponent);
            let fgColor = glyph.fgColor;
            let bgColor = glyph.bgColor;
            if (memorized) {
                fgColor = config.map.memorizedColor.fgColor;
                bgColor = config.map.memorizedColor.bgColor;
            }
            const viewPosition =
                position
                    .toVictor().clone()
                    .add(new Victor(config.map.offset.x, config.map.offset.y));
            this.display.draw(
                viewPosition.x, viewPosition.y,
                glyph.symbol, fgColor, bgColor
            );
        }
    }
}
