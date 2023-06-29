import Common_Tools from "./Common_Tools";
import { Constants } from "./Constants";
import { CustomEventListener } from "./CustomEventListener";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UICtrl extends cc.Component {

    @property(cc.Node)
    bulletPanel: cc.Node = null;

    @property(cc.Node)
    guide: cc.Node = null;

    bulletCounts:number;

    @property(cc.Node)
    download: cc.Node = null;

    // @property
    // text: string = 'hello';

    start () {
        // init logic
        //this.label.string = this.text;
        CustomEventListener.on(Constants.EventName.SHOOT,this.shoot,this);
        this.bulletCounts = this.bulletPanel.childrenCount;
        let canvas = cc.find("Canvas");
        canvas.on(cc.Node.EventType.TOUCH_START,this.hideGuide,this);
        this.download.on(cc.Node.EventType.TOUCH_START,this.openStore,this);
        CustomEventListener.on(Constants.EventName.INIT,this.onInit,this);
    }

    onInit(){
        let hide2 = cc.find("Canvas/notice");
        if(hide2) hide2.active = true;
        this.guide.active = true;
    }

    shoot(){
        this.bulletPanel = cc.find("Canvas/bulletPanel");
        let bulletNode = this.bulletPanel.children[this.bulletCounts-1];
        if(bulletNode)
        {
            bulletNode.getComponent(cc.Animation).play();
            this.bulletCounts --;
        }
        
    }

    openStore(){
        Common_Tools.instance.openPlateForm();
    }

    hideGuide(){
        let hide2 = cc.find("Canvas/notice");
        if(hide2) hide2.active = false;
        this.guide.active = false;
    }

    
}
