import {Director, Geometry, THREE} from './../utility/import'

export default class GameScene3D{

    //scene = null;

    constructor(){
        this.scene = null;
        this.box = undefined;
        this.init();
    }

    init(){
        this.scene = new THREE.Scene();

        let aLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(aLight);

        // let plane = Geometry.shared().createPlane(400,400);
        // this.scene.add(plane);
        // plane.position.y = -25;
        // plane.position.x = -Math.PI * 0.5;
        // plane.position.z = -100;

        let color = '#' + (~~(Math.random() * (1 << 24))).toString(16);
        this.box = Geometry.shared().createBox(80, 80, 80, {color: color});
        this.box.position.set(0, 0, 0);
        this.scene.add(this.box);
        Director.shared().setCameraPosition(80, 0, 180);
    }

    update(dt){
        this.box.rotation.z += 0.05;
        this.box.rotation.x += 0.05;
        //console.log('dt=>',dt);
    }
}