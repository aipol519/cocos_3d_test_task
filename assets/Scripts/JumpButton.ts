import { _decorator, Component, Node, Input, EventTouch, CCInteger } from 'cc';
import { PlayerController } from "./PlayerController";
import { RedirectCounter } from "./RedirectCounter";
const { ccclass, property } = _decorator;

@ccclass('JumpButton')
export class JumpButton extends Component {

    @property({type: CCInteger})
    public jumpStep: number = 1;

    @property({type: PlayerController})
    public playerController: PlayerController = null;

    @property({type: RedirectCounter})
    public redirectCounter: RedirectCounter = null;

    start() {
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd(event: EventTouch) {
        this.redirectCounter.node.emit('IncreaseRedirectCounter');
        this.playerController.node.emit('Jump', this.jumpStep);
    }
}

