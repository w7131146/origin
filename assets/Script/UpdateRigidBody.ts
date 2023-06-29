// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UpdateRigidBody extends cc.Component {

    update(dt) {
        if(!this.node.getComponent(cc.RigidBody))
        {
           console.log(11111111);
        }
        this.node.getComponent(cc.RigidBody).syncPosition(true);

        let collider = this.node.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            let scale = this.node.scale;
            collider.size.width *= scale;
            collider.size.height *= scale;
            collider.apply();
        }

        let collider1 = this.node.getComponent(cc.PhysicsPolygonCollider);
        if (collider1) {
            let scale = this.node.scale;
            let points = collider1.points;
            let newPoints = [];
            for (let i = 0; i < points.length; i++) {
                newPoints.push(cc.v2(points[i].x * scale, points[i].y * scale));
            }
            collider1.points = newPoints;
            collider1.apply();
        }

        let collider2 = this.node.getComponent(cc.PhysicsChainCollider);
        if (collider2) {
            let scale = this.node.scale;
            let points = collider2.points;
            let newPoints = [];
            for (let i = 0; i < points.length; i++) {
                newPoints.push(cc.v2(points[i].x * scale, points[i].y * scale));
            }
            collider2.points = newPoints;
            collider2.apply();
        }
    }
}
