import {THREE} from '../../utility/import'

export default class Geometry {
    static instance;
    constructor(){

    }

    static shared(){
        if(false === this.instance instanceof this){
            this.instance = new this;
        }
        return this.instance;
    }

    createPlane(width, height){
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
            new THREE.MeshLambertMaterial({color: 0xffffff}));
        return plane;
    }

    createBox(width, height, depth, option){
        let box = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshLambertMaterial(option);
        let mesh = new THREE.Mesh(box, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
}