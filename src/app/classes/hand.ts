export class Hand {
    public id: number;
    public yourHand: string;
    public flop: string;
    public turn: string;
    public river: string;
    public handDate: string;
    public comments: string;
    public button: string;
    public potSize: number;
    public winFlg: boolean;
    public allHands = [];

    public postFlopAction:string;
    public postFlopBet:string;
    public postFlopOdds:string;

    public preFlopAction:string;
    public preFlopBet:string;
    public preFlopOdds:string;

    public turnAction:string;
    public turnBet:string;
    public turnOdds:string;

    public riverAction:string;
    public riverBet:string;
    public riverOdds:string;

    public startingChips:number;
    public result:string;

    //derived
    public name: string;

    constructor(obj: any, id:number) {
        if (!obj)
            obj = {};

        if(!obj.id && id>0) {
            obj.id = id;
        }
        this.id = obj.id || 1;
        this.yourHand = obj.yourHand || '';
        this.flop = obj.flop || '';
        this.turn = obj.turn || '';
        this.river = obj.river || '';
        this.handDate = obj.handDate || '';
        this.comments = obj.comments || '';
        this.button = obj.button || '';
        this.potSize = obj.potSize || 0;
        this.winFlg = obj.winFlg;
        this.allHands = obj.allHands || [];

        this.postFlopAction = obj.postFlopAction;
        this.postFlopBet = obj.postFlopBet;
        this.postFlopOdds = obj.postFlopOdds;
        this.preFlopAction = obj.preFlopAction;
        this.preFlopBet = obj.preFlopBet;
        this.preFlopOdds = obj.preFlopOdds;

        this.turnAction = obj.turnAction;
        this.turnBet = obj.turnBet;
        this.turnOdds = obj.turnOdds;

        this.riverAction = obj.riverAction;
        this.riverBet = obj.riverBet;
        this.riverOdds = obj.riverOdds;

        this.startingChips = obj.startingChips;

        this.allHands.forEach(player => {
            player.isButton = (player.name == this.button);
        });
        if(this.allHands && this.allHands.length>0) {
            obj.result = this.allHands[0].result;
        }
        this.result = obj.result || '';
        this.name = this.yourHand +' ('+ this.result+')';

    }
}
