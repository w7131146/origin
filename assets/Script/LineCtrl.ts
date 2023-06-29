import Common_Tools from "./Common_Tools";
import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";
import { PoolManager } from "./PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LineCtrl extends cc.Component {

    @property(cc.Node)
    Canvas: cc.Node = null;

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    @property
    line_length: number = 500;
    ctx: cc.Graphics;
    /* 线的方向 */
    direction: cc.Vec2;
    /* 线的起始坐标 */
    origin: cc.Vec2;
    @property(cc.Node)
    gan: cc.Node;

    @property(cc.Node)
    spineNode: cc.Node;

    bulletNode: cc.Node;

    @property(cc.Texture2D)
    streakTexture: cc.Texture2D;

    touchPoint:cc.Vec2;

    protected onLoad(): void {
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags =1;
    }
    start() {
        if(!this.node) this.node = cc.find("Canvas/main/human/line")
        
        this.ctx = this.node.getComponent(cc.Graphics);
        this.direction = cc.v2(this.line_length, 0);
        this.Canvas.on(cc.Node.EventType.TOUCH_START, this.startTouch, this);
        this.Canvas.on(cc.Node.EventType.TOUCH_END, this.endTouch, this);
        CustomEventListener.on(Constants.EventName.GAME_OVER, this.gameOver, this);
        this.createBullet();
        CustomEventListener.on(Constants.EventName.UPDATE_LINE,this.fanTan2,this);
    }

    gameOver() {
        this.Canvas = cc.find("Canvas");
        this.Canvas.off(cc.Node.EventType.TOUCH_START, this.startTouch, this);
        this.Canvas.off(cc.Node.EventType.TOUCH_END, this.endTouch, this);
    }

    startTouch(e) {
        if(!Constants.Flying)
        {
            Constants.Flying = true;  
        }
        else{
            return;
        }
        this.Canvas = cc.find("Canvas");
        this.Canvas.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.scheduleOnce(() => {
            this.fanTan(e);
        })
    }

    endTouch(e) {
        this.ctx.clear();
        this.scheduleOnce(() => {
            Common_Tools.instance.playAudio(Constants.AudioSource.FIRE);
            this.bulletNode.opacity = 255;
            this.bulletNode.getChildByName("motionStreak").getComponent(cc.MotionStreak).texture = this.streakTexture;
            let rigidBody = this.bulletNode.getComponent(cc.RigidBody);
            let startPoint = this.node.convertToWorldSpaceAR(this.origin);
            this.touchPoint = this.node.convertTouchToNodeSpaceAR(e);
            //let gunPoint = Common_Tools.instance.convertOtherNodeSpaceAR(this.gan, this.node.parent);
            let powerV2:cc.Vec2 = this.touchPoint.sub(this.origin).normalize();
            rigidBody.linearVelocity = cc.v2(1000*powerV2.x,powerV2.y*1000);
            this.Canvas.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
            CustomEventListener.dispatchEvent(Constants.EventName.SHOOT);
        })
    }

    createBullet() {
        if(!this.node) this.node = cc.find("Canvas/main/human/line")
        this.bulletNode = PoolManager.getNode(this.bullet, this.node);
        this.bulletNode.getChildByName("motionStreak").getComponent(cc.MotionStreak).texture = null;;
        this.bulletNode.opacity = 1;
        let gunPoint = Common_Tools.instance.convertOtherNodeSpaceAR(this.gan, this.node.parent);
        this.origin = gunPoint;
        this.bulletNode.setPosition(cc.v2(0, 0));
        this.bulletNode.getComponent(cc.RigidBody).syncPosition(true);
    }

    touchMove(e) {
        this.fanTan(e);
    }
    fanTan(e) {

        if(this.node.parent.convertTouchToNodeSpaceAR(e).x<205) return;
        let gunPoint = Common_Tools.instance.convertOtherNodeSpaceAR(this.gan, this.node.parent);
        let p = cc.v2(this.node.parent.convertTouchToNodeSpaceAR(e).x - gunPoint.x, this.node.parent.convertTouchToNodeSpaceAR(e).y - gunPoint.y).normalize();
        this.origin = gunPoint;
        this.bulletNode.setPosition(this.origin);
        this.direction = cc.v2(1000, p.y * 1000 / p.x);
        let startPoint = this.node.convertToWorldSpaceAR(this.origin);
        let endPoint = this.node.convertTouchToNodeSpaceAR(e);
        let results = cc.director.getPhysicsManager().rayCast(startPoint, endPoint, cc.RayCastType.Closest);
        if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let collider = result.collider;
                let point = result.point;
                let normal = result.normal;
            }
            this.ctx.clear();
            this.ctx.lineWidth = 20;
            this.ctx.moveTo(this.origin.x, this.origin.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
        }
    }

    fanTan2(e) {
        this.node = cc.find("Canvas/main/human/line");
        if(!this.node) this.node = cc.find("Canvas/main/human/line")
        this.ctx = this.node.getComponent(cc.Graphics);
        this.gan = cc.find("Canvas/main/human/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:111/ATTACHED_NODE:body/ATTACHED_NODE:body9/ATTACHED_NODE:body2/ATTACHED_NODE:right_arm_01/ATTACHED_NODE:right_hand/ATTACHED_NODE:gun/gun");
        let gunPoint = Common_Tools.instance.convertOtherNodeSpaceAR(this.gan, this.node.parent);
        let localPos = this.node.parent.convertToNodeSpaceAR(e);
        let p = cc.v2(localPos.x - gunPoint.x, localPos.y - gunPoint.y).normalize();
        this.origin = gunPoint;
        if(!this.bullet)
        {
            cc.loader.loadRes("Prefab/bullet", cc.Prefab, (err, bullet) => {
                this.bullet = bullet;

                if(!this.bulletNode) this.createBullet();
                this.bulletNode.setPosition(this.origin);
                this.direction = cc.v2(1000, p.y * 1000 / p.x);
                let startPoint = this.node.convertToWorldSpaceAR(this.origin);
                let endPoint = this.node.convertToNodeSpaceAR(e);;
                let results = cc.director.getPhysicsManager().rayCast(startPoint, endPoint, cc.RayCastType.Closest);
                if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        let collider = result.collider;
                        let point = result.point;
                        let normal = result.normal;
                        // 处理碰撞信息
                    }
                    this.ctx.clear();
                    this.ctx.lineWidth = 20;
                   // let endPoint = this.node.convertToNodeSpaceAR(results[0].point);
                    this.ctx.moveTo(this.origin.x, this.origin.y);
                    this.ctx.lineTo(endPoint.x, endPoint.y);
                    this.ctx.stroke();
                }
                return;
            });
        }
        
        //this.createBullet();
        this.bulletNode.setPosition(this.origin);
        this.direction = cc.v2(1000, p.y * 1000 / p.x);
        let startPoint = this.node.convertToWorldSpaceAR(this.origin);
        let endPoint = this.node.convertToNodeSpaceAR(e);;
        let results = cc.director.getPhysicsManager().rayCast(startPoint, endPoint, cc.RayCastType.Closest);
        if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let collider = result.collider;
                let point = result.point;
                let normal = result.normal;
                // 处理碰撞信息
            }
            this.ctx.clear();
            this.ctx.lineWidth = 20;
           // let endPoint = this.node.convertToNodeSpaceAR(results[0].point);
            this.ctx.moveTo(this.origin.x, this.origin.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
        }
    }

    update(dt) {


    }
}
