import { Display } from "rot-js";
import Victor from "victor";
import config from "../config";
import coreConfig from "../core/core-config";
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import GlyphComponent from "../components/glyph-component";
import Position2DCompoent from "../components/position-2d-component";
import DeepComponent from "../components/deep-compnent";

export default class DisplaySystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     * @param {Display} display 
     */
    constructor(engine, display) {
        super(engine);
        this.drawableEntities = new SmartEntitiesContainer(engine, [
            GlyphComponent, Position2DCompoent, DeepComponent
        ]);
        this.drawableEntities.on(
            coreConfig.smartEntitiesContainerEvents.changed,
            () => {
                this.drawableEntities.getEnties().sort((a, b) => {
                    return a.get(GlyphComponent).zLevel - b.get(GlyphComponent).zLevel;
                });
            }
        );
        this.display = display;
    }
    erase() {
        super.erase();
        this.drawableEntities.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (!this.getPlayer()) {
            return;
        }
        let fov = this.getPlayerFov().fov;
        let memorizedFovArea = this.getPlayerMemorizedFovArea().memorizedFovArea;
        const deepOfPlayer = this.getPlayerDeep();
        for (let entity of this.drawableEntities.getEnties()) {
            const position = entity.get(Position2DCompoent);
            const deepOfEntity = entity.get(DeepComponent).deep;
            if (deepOfEntity != deepOfPlayer) {
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
                new Victor(config.map.offset.x, config.map.offset.y)
                    .add(position);
            this.display.draw(
                viewPosition.x, viewPosition.y,
                glyph.symbol, fgColor, bgColor
            );
        }
    }
}
