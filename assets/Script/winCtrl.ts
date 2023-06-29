// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Common_Tools from "./Common_Tools";
import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinCtrl extends cc.Component {

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    twd: cc.Node = null;

    @property(cc.Node)
    hide1: cc.Node = null;

    @property(cc.Node)
    hide2: cc.Node = null;
    @property(cc.Label)
    IQNum: cc.Label = null;

    @property(cc.Label)
    zan: cc.Label = null;

    @property
    win: boolean = false;

    @property(cc.Node)
    reTry: cc.Node;

    protected onEnable(): void {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_OVER);
        this.mask.active = true;
        this.onResize();
        CustomEventListener.on(Constants.EventName.RESIZE, this.onResize, this);
        this.hide1 = cc.find("Canvas/download");
        this.hide2 = cc.find("Canvas/notice");
        if(this.hide1) this.hide1.active = false;
        if(this.hide2) this.hide1.active = false;
        this.node.parent.on(cc.Node.EventType.TOUCH_START,this.openStore,this);
        this.zan = this.node.getChildByName("zan").getComponent(cc.Label);
        if(this.win)
        {
            this.schedule(()=>{
                this.IQNum.string = ""+(Math.floor(Math.random()*100)+150); 
             },0.05,20);
            this.zan.string = Constants.talkTableWin[Math.floor(Math.random()*Constants.talkTableWin.length)];
        }
        else{
            this.schedule(()=>{
                this.IQNum.string = ""+(Math.floor(Math.random()*50)); 
             },0.05,20)
            this.zan.string = Constants.talkTableFail[Math.floor(Math.random()*Constants.talkTableFail.length)];
        }
        this.scheduleOnce(()=>{
            this.zan.node.active = true;
         },1)
         if(this.reTry)
         {
            this.reTry.on(cc.Node.EventType.TOUCH_START,()=>{
                //cc.director.loadScene(cc.director.getScene().name);
                Constants.Flying = false
             },this)
         }
    }

    onLoad() {

    }

    public onResize() {
        if (!this.twd) return;
        let frameSizeWidth: number = cc.view.getFrameSize().width;
        let frameSizeHeight: number = cc.view.getFrameSize().height;
        this.twd = this.node.getChildByName("twd");
        let twdWgt: cc.Widget = this.twd.getComponent(cc.Widget);
        if (frameSizeWidth > frameSizeHeight) {
            twdWgt.isAlignLeft = twdWgt.isAlignTop = true;
            twdWgt.left = 31;
            twdWgt.top = 31;
            twdWgt.isAlignHorizontalCenter = false;
        }
        else {
            twdWgt.isAlignLeft = twdWgt.isAlignTop = false;

            twdWgt.isAlignHorizontalCenter = twdWgt.isAlignVerticalCenter = true;
            twdWgt.horizontalCenter = 0;
            twdWgt.isAbsoluteVerticalCenter = false;
            twdWgt.verticalCenter = 0.3;
            twdWgt.top = 31;
        }
    }

    openStore(){
        Common_Tools.instance.openPlateForm();
    }

}
