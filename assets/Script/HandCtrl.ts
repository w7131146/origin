// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HandCtrl extends cc.Component {

    start() {
        this.node.scale = 0;
        cc.tween(this.node).to(0.1, { scale: 1 }).to(0.8, { y: this.node.y - 50 }).to(0.8, { y: this.node.y + 50 }).union().repeatForever().start();
    }

    protected update(dt: number): void {
        if (this.node.active && this.node.scale == 1) {
            // 假设 node 是需要转换的节点
            let worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0)); // 将节点的局部坐标转换为世界坐标
            let viewportRect = cc.view.getViewportRect(); // 获取视口矩形

            // 计算节点在屏幕上的位置
            let screenPos = cc.v2(
                (worldPos.x - viewportRect.x) / cc.view.getScaleX(),
                (worldPos.y - viewportRect.y) / cc.view.getScaleY()
            );
            CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_LINE, worldPos);
        }
    }

}
