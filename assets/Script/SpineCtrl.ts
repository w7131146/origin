// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let skeleton = this.node.getComponent(sp.Skeleton);
        let boneNode = skeleton.findBone("aim");
        //let slotNode = skeleton.findSlot("slot1");
        boneNode.x = 100;
        boneNode.y = 100;

        //slotNode && slotNode.setPosition(150, 50)
    }

    // update (dt) {}
}
