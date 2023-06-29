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
export default class HorseCtrl extends cc.Component {

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider)
    {
        if(otherCollider.node.name == "bullet")
        {
            Common_Tools.instance.playAudio(Constants.AudioSource.DONG);
        }
    }	
}
