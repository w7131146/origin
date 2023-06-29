const { ccclass, property } = cc._decorator;

@ccclass
export default class DelAnimation extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property
    interv: number = 0.1;
    @property
    isLoop: boolean = true;

    @property
    stopEnd: boolean = true;

    @property
    autoPlay: boolean = true;
    private imgs: cc.SpriteFrame[] = null;
    _isRun = false;
    callback = null;
    finishStatus: boolean = false;
    isReverse: boolean = false;
    time = 0;
    index = 0;

    private _PlayEndRemove:boolean;

     onLoad() {
         if(this.autoPlay)
         {
             this.playAniNormal();
         }
        
    }

    initData(callback?, imgs?, icon?) {
        if (imgs) this.imgs = imgs;
        else if (this.atlas) {
            this.imgs = this.atlas.getSpriteFrames();
        }
        if (icon) {
            this.icon = icon;
           
            this.icon.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this.icon.spriteFrame = this.imgs[this.index];
            this.icon.node.width = this.icon.spriteFrame.getRect().width;
            this.icon.node.height = this.icon.spriteFrame.getRect().height;
        }
        if (callback) {
            this.callback = callback;
        }


    }
     
    updateAltas(atlas:cc.SpriteAtlas,interval = 0.1)
    {
        this.finishStatus = true;
        this.atlas = atlas;
        this.imgs = this.atlas.getSpriteFrames();
        this.closeAni();
        this.interv = interval;
        this.imgs = this.atlas.getSpriteFrames();
        this.icon.node.width = this.icon.spriteFrame.getRect().width;
        this.icon.node.height = this.icon.spriteFrame.getRect().height;
        this.finishStatus = false;
        this._isRun = true;
        this.icon.node.active = true;
        this.time = 0;
        this.index = 0;
        this.setIconFrameIndex(0);
        this.resumeAni();
    }

    setFinishCallback(_callback) {
        this.callback = _callback;
    }
    setFinishStatus(param: boolean) {
        this.finishStatus = param;
    }

    pauseAnimation()
    {
        this._isRun = false;
    }
    update(dt) {
        if (!this._isRun) 
            return;
        this.time += dt;
        if (this.time >= this.interv) {
            this.time = 0;
            if (this.isReverse) {
                this.index--;
                if (this.index <= -1) {
                    this.index = this.imgs.length - 1;
                    if (!this.isLoop&&!this._PlayEndRemove) {
                        this.closeAni();
                    }
                    else if(this._PlayEndRemove){
                        this._isRun = false;
                    }
                    this.callback && this.callback();
                    this.callback = null;
                }
                else {
                    this.icon.spriteFrame = this.imgs[this.index];
                }
            }
            else {
                this.index++;
                if (this.index >= this.imgs.length) {
                    this.index = 0;
                    if (!this.isLoop&&!this._PlayEndRemove) {
                        this.closeAni();
                    }
                    else if(this._PlayEndRemove){
                        this._isRun = false;
                    }
                    this.callback && this.callback();
                    this.callback = null;
                }
                else {
                    this.icon.spriteFrame = this.imgs[this.index];
                }
            }
        }
    }
    /**
     * 正向播放动画
     */
    playAniNormal(playEnd:boolean = false): void {
        this.isReverse = false;
        this._PlayEndRemove = playEnd;
        if (this.imgs == null) {
            this.initData();
        }
        if (this.imgs && this.imgs.length == 0) {
            return;
        }
        this.icon.node.active = true;
        this._isRun = true;
        this.time = 0;
        this.index = 0;
    }

    /**
     * 反向播放动画
     */
    playAniReverse(interval: number): void {
        this.isReverse = true;
        if (this.imgs == null) {
            this.initData();
        }
        if (this.imgs && this.imgs.length == 0) {
            return;
        }
        this.interv = interval;
        this.icon.node.active = true;
        this._isRun = true;
        this.time = 0;
        this.index = this.imgs.length - 1;
    }

    setIconFrameIndex(index: number = 0) {
        this.icon.spriteFrame = this.imgs[index];
    }

    gotoAndStopEnd(){
        this.icon.node.active = true;
        this.icon.spriteFrame = this.imgs[this.imgs.length -1];
    }

    /**关闭动画 */
    closeAni() {
        this._isRun = false;
        this.icon.node.active = this.finishStatus;
        this.icon.spriteFrame = this.imgs[0];
    }

    resumeAni() {
        if (this.imgs && this.imgs.length == 0) {
            return;
        }
        this._isRun = true;
    }
}
