import {Director, Geometry, THREE, TWEEN} from './../utility/import'
import Role from './role'

const GameState = {
    Invalide: -1,
    WaitStart: 1,
    Ready: 2,
    Running: 3,
    GameOvering: 4,
    GameOver: 5,
    Wining: 6
};

export default class GameScene3D {

    //scene = null;

    constructor() {
        this.role = undefined;
        this.scene = undefined;
        this.plane = undefined;
        this.pointLight = undefined;
        this.boxList = [];
        this.left = undefined;

        this.state = GameState.Invalide;

        this.init();
        this.listen();
        this.setState(GameState.WaitStart);
    }

    init() {
        this.scene = new THREE.Scene();
        // let axes = new THREE.AxesHelper(200);
        // this.scene.add(axes);

        // let grid = new THREE.GridHelper(1000, 16, 0x008800, 0x808080);
        // this.scene.add(grid);

        this.pointLight = new THREE.PointLight(0xffffff, 0.8);
        this.scene.add(this.pointLight);
        this.pointLight.position.set(400, 300, 200);

        let aLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(aLight);

        this.plane = Geometry.shared().createPlane(1000, 1000);
        this.scene.add(this.plane);
        this.plane.position.y = -25;
        this.plane.rotation.x = -Math.PI * 0.5;

        Director.shared().setCameraPosition(200, 200, 200);
    }

    listen() {
        wx.onTouchStart(event => {
            if (this.state === GameState.Running) {
                if (this.role) {
                    this.role.recPower();
                }
            }
        });

        wx.onTouchEnd(event => {
            if (this.state === GameState.WaitStart) {
                this.setState(GameState.Ready);
            } else if (this.state === GameState.Running) {
                if (this.role) {
                    this.role.jump(this.left, this.boxList[this.boxList.length - 1], () => {
                        this.check();
                    });
                }
            }
        });
    }

    createOneBox() {
        let color = '#' + (~~(Math.random() * (1 << 24))).toString(16);
        let box = Geometry.shared().createBox(80, 50, 80, {color: color});
        if (this.boxList.length === 0) {
            box.position.set(0, 0, 0);
        } else {
            let left = (Math.random() * 2 - 1) > 0 ? true : false;
            this.left = left;
            let distance = Math.random() * 50 + 100;
            let lastBox = this.boxList[this.boxList.length - 1];
            if (left) {
                box.position.x = lastBox.position.x - distance;
                box.position.z = lastBox.position.z;
            } else {
                box.position.z = lastBox.position.z - distance;
                box.position.x = lastBox.position.x;
            }
        }
        this.boxList.push(box);
        this.scene.add(box);
        if (this.boxList.length >= 7) {
            this.scene.remove(this.boxList[0]);
            this.boxList.splice(0, 1);
        }
    }

    check() {
        let collisionIndex = undefined;
        for (let i = 0; i < this.boxList.length; i++) {
            if (this.collision(this.boxList[i].getRect(), this.role.getPoint())) {
                collisionIndex = i;
            }
        }
        if (collisionIndex === this.boxList.length - 1) {
            this.setState(GameState.Wining);
        } else {
            this.setState(GameState.GameOver);
        }
    }

    collision(rect, point) {
        if (point.x > (rect.x - rect.width / 2) &&
            point.x < (rect.x + rect.width / 2) &&
            point.y > (rect.y - rect.height / 2) &&
            point.y < (rect.y + rect.height / 2)) {
            return true;
        }
        return false;
    }

    moveCamera(cb) {
        let firstBox = this.boxList[this.boxList.length - 2];
        if (firstBox) {
            this.plane.position.set(firstBox.position.x, -25, firstBox.position.z);
            this.pointLight.position.set(firstBox.position.x + 200, 400, firstBox.position.z - 200);
        }
        let box = this.boxList[this.boxList.length - 1];
        let targetPos = {x: box.position.x, z: box.position.z};
        let position = {x: Director.shared().camera.position.x, z: Director.shared().camera.position.z};
        let action = new TWEEN
            .Tween(position)
            .to({x: targetPos.x + 200, z: targetPos.z + 200}, 200)
            .onUpdate(() => {
                Director.shared().setCameraPosition(position.x, 200, position.z);
            })
            .onComplete(() => {
                if (cb) {
                    cb();
                }
            });
        action.start();
    }


    update(dt) {
        if (this.role) {
            this.role.update(dt);
        }
        if(this.state === GameState.GameOver){
            this.setState(GameState.WaitStart);
        }
    }

    setState(state) {
        if (this.state === state) {
            return;
        }

        switch (state) {
            case GameState.WaitStart:
                for (let i = 0; i < this.boxList.length; i++) {
                    this.scene.remove(this.boxList[i]);
                }
                this.boxList = [];
                for (let i = 0; i < 2; i++) {
                    this.createOneBox();
                }
                this.moveCamera();
                break;
            case GameState.Ready:
                if (this.role === undefined) {
                    this.role = Role();
                    this.scene.add(this.role);
                }
                this.role.ready(() => {
                    this.setState(GameState.Running);
                });
                break;
            case GameState.Running:
                break;
            case GameState.GameOver:
                console.log('GameOver.');
                // setTimeout(() => {
                //     this.setState(GameState.WaitStart);
                // }, 1000);
                break;
            case GameState.Wining:
                console.log('Wining...')
                this.createOneBox();
                this.moveCamera(() => {
                    this.setState(GameState.Running);
                });
                break;
            default:
                break;
        }

        this.state = state;
    }
}