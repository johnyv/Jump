import {THREE, PIXI} from '../../utility/import'

let ctx = canvas.getContext('webgl');
const radio = window.devicePixelRatio;
const width = window.innerWidth;
const height = window.innerHeight;

export default class Director{
    static instance;

    constructor(){
        //three.js
        this.renderer3D = undefined;
        this.scene3D = undefined;
        this.clock = undefined;
        this.camera = undefined;

        //pixi.js
        this.renderer2D = undefined;
        this.scene2D = undefined;
        this.init();
        this.animate();
    }

    static shared(){
        if(false === this.instance instanceof this){
            this.instance = new this;
        }
        return this.instance;
    }

    init(){
        this.renderer3D = new THREE.WebGLRenderer({
            canvas:canvas,
            context:ctx,
            alpha:true,
            antialias:true
        });
        this.renderer3D.setClearColor(0xdbe6e6);
        this.renderer3D.setPixelRatio(radio);
        this.renderer3D.setSize(width,height);
        this.renderer3D.shadowMap.enabled = true;

        this.camera = new THREE.OrthographicCamera(width/2*-1,width/2,
            height/2,height/2*-1,
            -1000,10000);
        this.camera.position.y = 100;

        this.clock = new THREE.Clock;

        this.renderer2D = new PIXI.WebGLRenderer({
            width:width,height:height,
            view:canvas
        });
    }

    start(scene3D, scene2D){
        this.scene3D = scene3D;
        this.scene2D = scene2D;
    }

    setCameraPosition(x,y,z){
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
    }

    setCameraLookAt(pos){
        this.camera.lookAt(pos);
    }

    getCameraPosition(){
        return this.camera.position;
    }

    animate(){
        var dt = this.clock.getDelta()*1000;

        this.renderer2D.reset();
        this.renderer3D.state.reset();
        if(this.scene3D){
            this.renderer3D.render(this.scene3D.scene, this.camera);
            this.scene3D.update(dt);
        }
        this.renderer3D.state.reset();
        this.renderer2D.reset();
        if(this.scene2D){
            this.renderer2D.render(this.scene2D.scene, undefined, false);
            this.scene2D.update(dt);
        }
        requestAnimationFrame(this.animate.bind(this), canvas);
    }
}