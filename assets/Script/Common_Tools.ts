
import { Constants } from "./Constants";
export default class Common_Tools {
    private static _instance: Common_Tools = null;

    public bgAudioClip: cc.AudioClip = null;
    public isPortrait: boolean = false;
    public spriteFrameList: cc.SpriteFrame[] = [];
    private isMute: boolean = false;
    private audioMap: { [audioName: string]: number } = {};
    
    private android_href: string = "https://play.google.com/store/apps/details?id=com.elex.twdsaw.gp";//主包
    private ios_href: string = "https://apps.apple.com/us/app/id1514546586";
    public static get instance(): Common_Tools {
        if (Common_Tools._instance == null) {
            Common_Tools._instance = new Common_Tools();
        }
        return Common_Tools._instance;
    }

    /**
     * 跳转应用商店
     */
    public openPlateForm() {
       
        var link = this.isAndroid() ? this.android_href : this.ios_href;
        window["dapi"] && window["dapi"].openStoreUrl();
        window["Liftoff"] && window["Liftoff"].open();
        window["mraid"] && window["mraid"].open(link);
        window["FbPlayableAd"] && window["FbPlayableAd"].onCTAClick();
        parent.postMessage('download', '*');
        window['ExitApi'] && window['ExitApi'].exit();
        parent.postMessage('complete', '*');
        window["install"] && window["install"]();
        window['gameEnd'] && window['gameEnd']();
        window['openAppStore'] && window['openAppStore']();
        window['ks_playable_openAppStore'] && window['ks_playable_openAppStore']();
        // window.open(link);
        // console.log("打开链接：" + link);
    }

    isAndroid(): boolean {
        let b = Boolean(navigator.userAgent.match(/android/ig));
        return b;
    }

    isPhone(): boolean {
        let b = Boolean(navigator.userAgent.match(/iphone|ipod/ig));
        return b;
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在中心
     */
    public localConvertWorldPointAR(node: cc.Node): cc.Vec2 {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在左下角
     */
    public localConvertWorldPoint(node: cc.Node): cc.Vec2 {
        if (node) {
            return node.convertToWorldSpace(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node中心
     */
    public worldConvertLocalPointAR(node: cc.Node, worldPoint: cc.Vec2): cc.Vec2 {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node左下角
     */
    public worldConvertLocalPoint(node: cc.Node, worldPoint: cc.Vec2): cc.Vec2 {
        if (node) {
            return node.convertToNodeSpace(worldPoint);
        }
        return null;
    }

    /**
     * 把一个节点的本地坐标转到另一个节点的本地坐标下
     */
    public convertOtherNodeSpace(node: cc.Node, targetNode: cc.Node): cc.Vec2 {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint: cc.Vec2 = this.localConvertWorldPoint(node);
        return this.worldConvertLocalPoint(targetNode, worldPoint);
    }

    /**
     * 把一个节点的本地坐标转到另一个节点的本地坐标下
     */
    public convertOtherNodeSpaceAR(node: cc.Node, targetNode: cc.Node): cc.Vec2 {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint: cc.Vec2 = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPoint);
    }

    /**
     * 播放背景音乐
     * @param url 
     * @returns 
     */
    public playBgMusic(): void {
        if (this.isMute) {
            cc.audioEngine.setMusicVolume(0);
        }
        else {
            cc.audioEngine.setMusicVolume(0.6);
        }
        cc.audioEngine.playMusic(this.bgAudioClip, true);
    }

    /**
     * 播放音效
     * @param audioName 
     * @param isLoop 音效是否循环播放
     * @param uncache 是否释放
     * @returns 
     */
    public playAudio(audioName: string, isLoop: boolean = false, uncache: boolean = true): void {
        let volume: number = 1;
        if (this.isMute) {
            volume = 0;
        }
        cc.loader.loadRes(audioName, cc.AudioClip, (err, audioClip) => {
            const audioId = cc.audioEngine.play(audioClip, isLoop, volume);
            if (isLoop) {
                this.audioMap[audioName] = audioId;
            }
            if (!isLoop && uncache) {
                cc.audioEngine.setFinishCallback(audioId, () => {
                    cc.audioEngine.uncache(audioClip);
                });
            }
        });
    }

    /**
     * 停止播放音效
     * @param audioName 
     */
    public stopAudio(audioName: string) {
        const audioId = this.audioMap[audioName];
        if (audioId) {
            cc.audioEngine.stop(audioId);
            this.audioMap[audioName] = null;
        }
    }

    public setMute(value: boolean) {
        this.isMute = value;
        if (this.isMute) {
            cc.audioEngine.setMusicVolume(0);
            for (const key in this.audioMap) {
                if (Object.prototype.hasOwnProperty.call(this.audioMap, key)) {
                    const element = this.audioMap[key];
                    cc.audioEngine.setVolume(element, 0);
                }
            }
        }
        else {
            cc.audioEngine.setMusicVolume(0.5);
            for (const key in this.audioMap) {
                if (Object.prototype.hasOwnProperty.call(this.audioMap, key)) {
                    const element = this.audioMap[key];
                    cc.audioEngine.setVolume(element, 1);
                }
            }
        }
    }

    /**
     * 含最大值，含最小值 
     */
    public getRandomIntInclusive(min: number, max: number): number {
        const value = Math.random() * (max - min + 1);
        return value | 0 + min;
    }

    public shuffle(arr: number[], startIndex: number = 0) {
        const len = arr.length;
        for (let i: number = startIndex; i < len; i++) {
            // 从 i 到最后随机选一个元素
            const rand = this.getRandomIntInclusive(i, len - 1);
            const temp = arr[i];
            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    /**
     * 屏幕适配
     */
    public async screenAdaptation() {
        let frameSizeWidth: number = cc.view.getFrameSize().width;
        let frameSizeHeight: number = cc.view.getFrameSize().height;
        if (frameSizeWidth > frameSizeHeight) {
            if (cc.view.getDesignResolutionSize().width != 1280) {
                cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.FIXED_HEIGHT);
            }
        }
        else {
            if (cc.view.getDesignResolutionSize().width != 720) {
                cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
            }
        }     
    }


    public glowFilter(renderComponent: cc.RenderComponent, color: cc.Vec4, colorSize: number, threshold: number) {
        cc.dynamicAtlasManager.enabled = false;
        let material = renderComponent.getMaterial(0);
        material.setProperty("glowColorSize", colorSize);
        material.setProperty("glowColor", color);
        material.setProperty("glowThreshold", threshold);
        renderComponent.setMaterial(0, material);
    }

    //复制到系统剪切板
    public webCopyString(str: string, cb?: Function) {

        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection()!;
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        }
        catch (err) {

        }
        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        cb && cb(success);
        if (success) {
            console.log("复制成功");
        }
        else {
            console.log("复制失败");
        }
        return success;
    }

    /* 计算剩余距离 */
    remainingDistance(point1:cc.Vec2,point2:cc.Vec2): number {
        let distance: number = Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
        return distance;
    }

    /* 两点之间角度 */
    twoPointAngle(p1:cc.Vec2,p2:cc.Vec2):number
    {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let p = cc.v2(dx,dy);
        var angle = p.signAngle(cc.v2(1,0));
        var degree = angle * 180 / Math.PI-90;          
        return degree;
    }

     /* 两点之间角度 */
     twoPointAngle2(p2:cc.Vec2,p1:cc.Vec2):number
     {
         let dx = p2.x - p1.x;
         let dy = p2.y - p1.y;
         let p = cc.v2(dx,dy);
         var angle = p.signAngle(cc.v2(1,0));
         var degree = angle * 180 / Math.PI-90;          
         return degree;
     }
    /* 移动方向 根据两点 isOblique45是否是斜45度角*/
    moveDirection(p1:cc.Vec2,p2:cc.Vec2,isOblique45:boolean = false):number{
        var direction:number = -1;
        var dregree = this.twoPointAngle(p1,p2);
        if(isOblique45)
        {
            dregree+=45;
        }         
        if(dregree<45&&dregree>= -45)
        {
            direction = Constants.Direction.FORWARD;
        } 
        else if(dregree>=45&&dregree< 135)
        {
            direction = Constants.Direction.RIGHT;
        }
        else if(dregree>=135&&dregree<225)
        {
            direction = Constants.Direction.BACKWARD;
        }
        else if(dregree< -45&&dregree>=-135)
        {
            direction = Constants.Direction.LEFT;
        }
        return direction;
    }

    direction8(p1:cc.Vec2,p2:cc.Vec2,isOblique45:boolean = false):number{
        var direction:number = -1;
        var dregree = this.twoPointAngle2(p1,p2);
        if(isOblique45)
        {
            dregree+=45;   
        }         
        if((dregree< -22.5&&dregree>=-57.5))
        {
            direction = Constants.DrawingOrientation.UPPER_LEFT;
        } 
        else if(dregree>= -102.5&&dregree< -57.5)
        {
            direction = Constants.DrawingOrientation.LEFT;
        }

        else if(dregree< -102.5&&dregree>=-157.5)
        {
            direction = Constants.DrawingOrientation.LOWER_LEFT;
        }
        else if(dregree>=-22.5&&dregree<22.5)
        {
            direction = Constants.DrawingOrientation.UPPER;
        }
        else if(dregree< 67.5&&dregree>=22.5)
        {
            direction = Constants.DrawingOrientation.UPPER_RIGHT;
        }
        else if((dregree< 90&&dregree>=67.5)||(dregree< -247.5&&dregree>=-270))
        {
            direction = Constants.DrawingOrientation.RIGHT;
        }
        else if(dregree< -202.5&&dregree>=-247.5)
        {
            direction = Constants.DrawingOrientation.LOWER_RIGHT;
        }
        else if(dregree< -157.5&&dregree>=-202.5)
        {
            direction = Constants.DrawingOrientation.LOWER;
        }
        
        return direction;
    }

    // /* 播放节点动画*/
    // playAinmation(node: cc.Node, callback?) {
    //     let del: DelAnimation = (node.getComponent("DelAnimation") as DelAnimation);
    //     if (del) {
    //         del.playAniNormal();
    //         if (callback) {
    //             del.setFinishCallback(callback);
    //         }
    //     } 
    // }

    //  /* 播放节点动画*/
    //  pauseAinmation(node: cc.Node, callback?) {
    //     let del: DelAnimation = (node.getComponent("DelAnimation") as DelAnimation);
    //     if (del) {
    //         del.pauseAnimation();
    //         del.gotoAndStopEnd();
            
            
    //         if (callback) {
    //             del.setFinishCallback(callback);
    //         }
    //     } 
    // }


    
    // updateDelAni(node:cc.Node,data:any,interv:number = 0.1,callback?,target?: any){
    //     let del: DelAnimation = node.getComponent("DelAnimation") as DelAnimation;
    //     if(del)
    //     {
    //         del.updateAltas(data,interv);
    //         if (callback) {
    //             del.setFinishCallback(callback);
    //         }
    //     }
    // }

    // closeDelAni(node:cc.Node){
    //     let del: DelAnimation = node.getComponent("DelAnimation") as DelAnimation;
    //     if(del)
    //     {
    //         del.closeAni();
    //     }
    // }
}
