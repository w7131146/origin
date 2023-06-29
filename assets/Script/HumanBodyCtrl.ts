// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HumanBodyCtrl extends cc.Component {

    @property(cc.Node)
    fall: cc.Node = null;

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider)
    {
        otherCollider.node.active = false;
        this.dead();
    }	

    dead()
    {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_FALL);
    }
}
