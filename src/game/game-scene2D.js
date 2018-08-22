import {PIXI} from './../utility/import'

export default class GameScene2D {
    constructor() {
        this.scene = null;
        this.img = undefined;
        this.init();
    }

    init() {
        this.scene = new PIXI.Container();

        var style = new PIXI.TextStyle({
            fontFamily: 'Arvo',
            fontSize: 32,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#3e1707'], // gradient
            stroke: '#a4410e',
            strokeThickness: 2,
        });

        var title = new PIXI.Text('Jump', style);
        title.x = 10;
        title.y = 10;
        this.scene.addChild(title);
    }

    update(dt) {
    }
}