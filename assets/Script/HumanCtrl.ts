// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Common_Tools from "./Common_Tools";
import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";
import DelAnimation from "./DelAnimation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HumanCtrl extends cc.Component {

    @property(cc.Node)
    fall: cc.Node = null;
    @property(cc.Node)
    Canvas: cc.Node = null;
    start () {
        if(!this.node) this.node = cc.find("Canvas/main/human")
        this.Canvas.on(cc.Node.EventType.TOUCH_START,this.startTouch,this);
        this.Canvas.on(cc.Node.EventType.TOUCH_END,this.endTouch,this);
        CustomEventListener.on(Constants.EventName.GAME_FALL,this.gameOver,this);
        CustomEventListener.on(Constants.EventName.UPDATE_LINE,this.updateAim,this);

        // this.node.addComponent(sp.Skeleton);
        // let skeleton = this.node.getComponent(sp.Skeleton);
        // skeleton.
    }

    startTouch(e){
        this.touchMove(e)
        this.Canvas.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
    }

    endTouch(e){
       
    }
    touchMove(e)
    {
        if(this.node.convertTouchToNodeSpaceAR(e).x<205) return;
        let skeleton = this.node.getComponent(sp.Skeleton);
        let boneNode = skeleton.findBone("aim");
        boneNode.x = this.node.convertTouchToNodeSpaceAR(e).x;
        boneNode.y = this.node.convertTouchToNodeSpaceAR(e).y;
    }

    updateAim(e){
        //if(!this.node) return;
        this.node = cc.find("Canvas/main/human")
        let skeleton = this.node.getComponent(sp.Skeleton);
        let boneNode = skeleton.findBone("aim");
        boneNode.x = this.node.convertToNodeSpaceAR(e).x;
        boneNode.y = this.node.convertToNodeSpaceAR(e).y;
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider)
    {
        this.scheduleOnce(()=>{
            this.fall.active = true;
            otherCollider.node.active = false;
        },1)
        this.dead();
        
    }	
    gameOver(){
        this.dead();
        this.scheduleOnce(()=>{
            this.fall = cc.find("Canvas/fail");
           this.fall.active = true;
        },1)
    }
    dead()
    {
        this.node.removeComponent(sp.Skeleton);
        if(!this.node) this.node = cc.find("Canvas/main/human");
        this.Canvas = cc.find("Canvas");
        this.Canvas.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.Canvas.off(cc.Node.EventType.TOUCH_START,this.startTouch,this);
        this.Canvas.off(cc.Node.EventType.TOUCH_END,this.endTouch,this);
        let deadAnimation = this.node.getChildByName("dead");
        deadAnimation.active = true;
        deadAnimation.getComponent(DelAnimation).playAniNormal();
        Common_Tools.instance.playAudio(Constants.AudioSource.HURT);
    }
    // update (dt) {}
}
