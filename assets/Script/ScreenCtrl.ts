// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";
//import UIController from "./UIController";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenCtrl extends cc.Component {

    @property(cc.Node)
    uiController: cc.Node = null;

    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Node)
    fall: cc.Node = null;

    @property(cc.Node)
    target: cc.Node  = null;

    @property
    isResize: boolean = true;

    protected start(): void {
        cc.view.setResizeCallback(() => {
            this.windowChange();
        });
        this.windowChange();
    }

    public windowChange(): void {

        if(this.isResize)
        {
            this.screenAdaptation().then(()=>{
                 this.mainNode.scale = Math.min(cc.view.getDesignResolutionSize().width/this.mainNode.width,cc.view.getDesignResolutionSize().height/this.mainNode.height);
                 CustomEventListener.dispatchEvent(Constants.EventName.RESIZE);
                 return;
            }
            )
        }
    }

     /**
     * 屏幕适配
     */
     public async screenAdaptation() {
        let frameSizeWidth: number = cc.view.getFrameSize().width;
        let frameSizeHeight: number = cc.view.getFrameSize().height;
        if (frameSizeWidth > frameSizeHeight) {
            Constants.CurrentScreenOrientation = Constants.EnumScreenOrientation.Horizontal;
            if (cc.view.getDesignResolutionSize().width != 1280) {
                cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.FIXED_WIDTH);
            }
        }
        else {
            Constants.CurrentScreenOrientation = Constants.EnumScreenOrientation.Vertical;
            if (cc.view.getDesignResolutionSize().width != 720) {
                cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_HEIGHT);
            }
        }     
    }
}
