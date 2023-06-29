// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Common_Tools from "./Common_Tools";
import { Constants } from "./Constants";
import DelAnimation from "./DelAnimation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyController extends cc.Component {

    @property(cc.Node)
    win: cc.Node = null;

    start () {
        console.log("aaaaa"+this.node);

    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider)
    {
        this.scheduleOnce(()=>{
            this.win.active = true;
           
        },1);
        otherCollider.node.active = false;
        this.dead();
    }	

    dead()
    {
        this.node.getComponent(DelAnimation).playAniNormal();
        Common_Tools.instance.playAudio(Constants.AudioSource.HAHAHA);
    }

    // update (dt) {}
}
