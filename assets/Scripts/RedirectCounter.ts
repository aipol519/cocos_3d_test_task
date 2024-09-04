import { _decorator, CCBoolean, CCInteger, CCString, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RedirectCounter')
export class RedirectCounter extends Component {

    @property({type: CCBoolean})
    public enableCount: boolean = false;

    @property({type: CCInteger})
    public countThreshold: number = 10;

    @property({type: CCString})
    public redirectLink: String = "";

    private _count: number = 0;

    start() {
        if (this.enableCount) {
            this.node.on('IncreaseRedirectCounter', this.onRedirectCounterIncreased, this);
        } 
    }

    onRedirectCounterIncreased() {
        this._count++;
        if (this._count > this.countThreshold) {
            sys.openURL(this.redirectLink);
        }
    }
}

