import {Director} from './utility/import'
import GameScene3D from './game/game-scene3D'
import GameScene2D from './game/game-scene2D'

export default class Main {
    constructor(){
        this.init();
    }

    init(){
        let scene3D = new GameScene3D();
        let scene2D = new GameScene2D();

        Director.shared().start(scene3D, scene2D);
    }
}