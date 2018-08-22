import {THREE, TWEEN} from './../utility/import'

const Role = function () {
    const RoleState = {
        Invalide: -1,
        Ready: 1,
        RecPower: 2,
        Jumping: 3,
        JumpEnd: 4
    };

    const initY = 65;
    const initHeight = 80;

    let that = new THREE.Mesh(
        new THREE.ConeGeometry(20, initHeight, 10),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    that.castShadow = true;

    let head = new THREE.Mesh(
        new THREE.DodecahedronGeometry(20, 2),
        new THREE.MeshLambertMaterial({color: 0xf81f1f})
    );
    head.castShadow = true;
    head.position.y = 40;
    that.add(head);

    let distance = 0;
    let scale = 1;
    let toLeft = undefined;
    let targetBox = undefined;
    that.state = RoleState.Invalide;

    that.update = function (dt) {
        if (that.state === RoleState.RecPower) {
            distance += 2;
            scale -= 0.008;
            if (scale <= 0.6) {
                scale = 0.6
            }
            if (distance > 300) {
                distance = 300;
            }
        }
        scaleBody(scale);
    };

    const scaleBody = function (scale) {
        that.scale.y = scale;
        that.position.y = initY + (1 - scale) * initHeight * -0.5;
    };

    that.ready = function (cb) {
        setState(RoleState.Ready, cb)
    };

    that.recPower = function () {
        if (that.state === RoleState.JumpEnd || that.state === RoleState.Ready) {
            setState(RoleState.RecPower);
        }
    };

    that.jump = function (left, target, cb) {
        if (that.state === RoleState.RecPower) {
            toLeft = left;
            targetBox = target;
            setState(RoleState.Jumping, cb);
        }
    };

    const setState = function (state, cb) {
        if (that.state === state) {
            return;
        }
        switch (state) {
            case RoleState.Ready:
                that.position.set(0, 120, 0);
                let readyPos = {y: that.position.y};
                let readyAction = new TWEEN.Tween(readyPos)
                    .to({y: initY}, 200)
                    .onUpdate(() => {
                        that.position.y = readyPos.y;
                    })
                    .onComplete(function () {
                        if (cb) {
                            cb();
                        }
                    });
                readyAction.start();
                break;
            case RoleState.RecPower:
                break;
            case RoleState.Jumping:
                scale = 1;
                scaleBody(scale);
                let cp = 0;
                if (toLeft) {
                    cp = that.position.x;
                } else {
                    cp = that.position.z;
                }
                let endP = {};
                if (toLeft) {
                    endP = {r: -Math.PI * 2, y: Math.PI, x: that.position.x - distance, z: targetBox.position.z};
                } else {
                    endP = {r: -Math.PI * 2, y: Math.PI, x: targetBox.position.x, z: that.position.z - distance};
                }
                let pos = {r: 0, y: 0, x: that.position.x, z: that.position.z};
                let jumpAction = new TWEEN.Tween(pos)
                    .to(endP, 400)
                    .onUpdate(() => {
                        that.position.y = Math.sin(pos.y) * 100 + initY;
                        if (toLeft) {
                            that.rotation.z = -pos.r;
                        } else {
                            that.rotation.x = pos.r;
                        }
                        that.position.x = pos.x;
                        that.position.z = pos.z;
                    })
                    .onComplete(() => {
                        setState(RoleState.JumpEnd);
                        if (cb) {
                            cb();
                        }
                    });
                jumpAction.start();
                break;
            case RoleState.JumpEnd:
                distance = 0;
                break;
            default:
                break;
        }

        that.state = state;
    };

    that.getPoint = function () {
        return {
            x: that.position.x,
            y: that.position.z
        }
    };

    that.die = function (cb) {
        if (cb) {
            cb();
        }
    };

    return that;
};
export default Role;