import {PIXI} from './../utility/import'

export default class GameScene2D{
    constructor(){
        this.scene = null;
        this.img = undefined;
        this.init();
    }

    init(){
        this.scene = new PIXI.Container();
        let imgTex = PIXI.Texture.fromImage('res/image/avator0.jpg');
        this.img = new PIXI.Sprite(imgTex);
        this.img.anchor.x = this.img.anchor.y = 0.5;
        this.img.position.x = window.innerWidth/2;
        this.img.position.y = window.innerHeight/2;
        this.img.scale.set(0.2);
        this.scene.addChild(this.img);
    }

    update(dt){
        this.img.rotation += 0.05;
        //console.log('dt=>',dt);
    }
}