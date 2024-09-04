import { _decorator, Component, Prefab, instantiate, Node, CCInteger, Vec3, Label} from 'cc';
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

enum BlockType{
    BT_NONE,
    BT_STONE,
};

enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

interface Block {
    blockType: BlockType;
    blockPosition: Vec3;
    block: Node;
}

@ccclass("GameManager")
export class GameManager extends Component {

    @property({type: Prefab})
    public cubePrfb: Prefab|null = null;

    @property({type: CCInteger})
    public roadWidth: number = 11;

    @property({type: PlayerController})
    public playerCtrl: PlayerController = null;

    @property({type: Node})
    public startMenu: Node = null;

    @property({type: Label})
    public stepsLabel: Label|null = null;

    private _road: Block[] = [];

    private _curState: GameState = GameState.GS_INIT;

    private _playerPosition: number = 0;

    start () {
        this.curState = GameState.GS_INIT;
        this.playerCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this);
    }

    onStartButtonClicked() {
        this.curState = GameState.GS_PLAYING;
    }

    init() {
        if (this.startMenu) {
            this.startMenu.active = true;
        }

        if (this.stepsLabel) {
            this.stepsLabel.enabled = false;
        }
    
        this._playerPosition = Math.floor((this.roadWidth - 1) / 2);

        this.generateRoad();

        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(Vec3.ZERO);
        }

        this.playerCtrl.reset();
    }

    set curState (value: GameState) {
        switch(value) {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                if (this.startMenu) {
                    this.startMenu.active = false;
                }
                if (this.stepsLabel) {
                    this.stepsLabel.enabled = true;
                    //  reset the number of steps to 0
                    this.stepsLabel.string = '0';
                }
                // set active directly to start listening for mouse events directly
                setTimeout(() => {
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true);
                    }
                }, 0.1);
                break;
            case GameState.GS_END:
                break;
        }
        this._curState = value;
    }

    generateRoad() {
        this.node.removeAllChildren();

        this._road = [];
        // startPos
        this._road.push({blockType: BlockType.BT_STONE, block: null, blockPosition: null});

        for (let i = 1; i < this.roadWidth; i++) {
            this._road.push({blockType: this.determineBlockType(i-1), block: null, blockPosition: null});
        }

        this._road[this._playerPosition].blockType = BlockType.BT_STONE

        for (let j = 0; j < this._road.length; j++) {
            this._road[j].block = this.spawnBlockByType(this._road[j].blockType);

            let newBlockPosition = new Vec3(j-this._playerPosition, -1.5, 0);
            this._road[j].blockPosition = newBlockPosition;

            if (this._road[j].block) {
                this.node.addChild(this._road[j].block);
                this._road[j].block.setPosition(newBlockPosition);
            }
        }
    }

    determineBlockType(previousBlockIndex: number) {
        if (this._road[previousBlockIndex].blockType === BlockType.BT_NONE) {
            return BlockType.BT_STONE;
        } else {
            return Math.floor(Math.random() * 2);
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.cubePrfb) {
            return null;
        }

        let block: Node|null = null;
        switch(type) {
            case BlockType.BT_STONE:
                block = instantiate(this.cubePrfb);
                break;
        }

        return block;
    }

    checkResult() {
        if (this._road[this._playerPosition].blockType == BlockType.BT_NONE) {
            this.curState = GameState.GS_INIT;
        }
    }

    onPlayerJumpEnd(moveIndex: number, jumpStep: number) {
        this.stepsLabel.string = '' + moveIndex;
        this.adjustRoad(jumpStep);
        this.checkResult();
    }

    adjustRoad(stepsCount: number) {
        for (let i = 0; i < stepsCount; i++) {
            if (this._road[0].block) {
                this._road[0].block.destroy();
            }
            this._road.shift();
           
            let blockTypeToAdd: BlockType = this.determineBlockType(this._road.length - 1);

            let lastIndex = this._road.push({blockType: blockTypeToAdd, block: null, blockPosition: null}) - 1;
            this._road[lastIndex].block = this.spawnBlockByType(this._road[lastIndex].blockType);

            let newBlockPosition = new Vec3(this._road[lastIndex - 1].blockPosition.x + 1, -1.5, 0);
            this._road[lastIndex].blockPosition = newBlockPosition;

            if (this._road[lastIndex].block) {
                this.node.addChild(this._road[lastIndex].block);
                
                this._road[lastIndex].block.setPosition(newBlockPosition);
            }
        }
    }
}