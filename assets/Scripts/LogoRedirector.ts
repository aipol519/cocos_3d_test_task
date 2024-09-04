import { _decorator, Component, Node, Input, EventTouch, sys, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LogoRedirector')
export class LogoRedirector extends Component {

    @property({type: CCString})
    public redirectLink: String = "";

    start() {
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd(event: EventTouch) {
        sys.openURL(this.redirectLink);
    }
}

