
const { ccclass, property } = cc._decorator;

enum EventName {
    GAME_FALL = "game_fall",
    GAME_WIN = "game_win",
    GAME_OVER = "GAME_OVER",
    RESIZE = "RESIZE",
    SHOOT = "SHOOT",
    UPDATE_LINE = "UPDATE_LINE",
    INIT = "init"
}

enum DirectionName{
    FORWARD = "forward",
    BACKWARD = "backward",
    LEFT = "left",
    RIGHT = "right" 
}

enum Direction{
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT 
}

enum DrawingOrientation{
    RIGHT,
    LOWER_RIGHT,
    LOWER,
    LOWER_LEFT,
    LEFT,
    UPPER_LEFT,
    UPPER,
    UPPER_RIGHT
}

enum ScreenOrientation
{
    Horizontal,
    Vertical
}

enum CustomerState {
    NONE,
    GREETING,
    GOODBYE,
}

enum AudioSource {
    BACKGROUND = 'background',
    DONG = 'Sound/dong',
    FIRE = 'Sound/fire',
    HURT = 'Sound/man_hurt',
    HAHAHA = 'Sound/hahaha',
    NEWORDER = 'newOrder',
    START = 'start',
    STOP = 'stop',
    TOOTING1 = 'tooting1',
    TOOTING2 = 'tooting2',
    WIN = 'win',
}

enum CarGroup {
    GameS = 1 << 0,
    MAIN_CAR = 1 << 1,
    OTHER_CAR = 1 << 2,
}

@ccclass("Constants")
export class Constants {
    public static EventName = EventName;
    public static CustomerState = CustomerState;
    public static AudioSource = AudioSource;
    public static CarGroup = CarGroup;
    public static DirectionName = DirectionName;
    public static Direction = Direction;
    public static DrawingOrientation = DrawingOrientation;
    public static EnumScreenOrientation = ScreenOrientation;
    public static CurrentScreenOrientation  = null;
    public static talkTableFail = [
        // '先生智商太高了！\n王多余先生麾下的卧龙凤雏，\n非您不能胜任。',
        // '先生才高八斗，学富五车\n当年您退出文坛，\n实乃国家一大损失。',
        // "因为您智商超群，举世闻名，\n萨达姆，卡扎菲纷纷派遣使者，\n请您出山主持大局。"
        "Click the button below for more levels \n waiting for you to challenge."
    ];

    public static talkTableWin= [
        // '因为您智商超群！\n纵然您百般推诿\n爱因斯坦还是硬塞给您一条华子后，\n才悻悻离开。',
        // '因为您智商超群！\n您已被联邦军队重点保护\n总统有意将她唯一的女儿许配给您。',
        // '因为您智商超群！\n您发明了时空穿梭机，\n并将智能手机带到了那个年代，\n多年以后，\n一个叫爱迪生的无名小卒郁郁而终！',
        "Oh my God !!! \nIt's truly a once-in-a-century genius! \nClick the button below for more levels\n waiting for you to challenge."
    ];

    public static UIPage = {
        mainUI: 'mainUI',
        gameUI: 'gameUI',
        resultUI: 'resultUI',
    };
    /* 子弹是否在飞行中 */ 
    public static Flying:boolean = false;

}