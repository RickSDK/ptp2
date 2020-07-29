declare var scrubGameAndCalculateProfit: any;

export class Game {
    public bankroll: string;
    public breakMinutes: number;
    public buyin: number;
    public cashout: number;
    public endTime: string;
    public food: number;
    public gameType: string;
    public id: number;
    public limit: string;
    public location: string;
    public notes: string;
    public rebuyAmount: number;
    public rebuys: number;
    public stakes: string;
    public startTime: string;
    public status: string;
    public tips: number;
    public tournamentFinish: number;
    public tournamentPaid: number;
    public tournamentSpots: number;
    public tournamentType: string;
    public type: string;

    //derived
    public daytime: string;
    public end: string;
    public endDate: string;
    public gross: number;
    public hourly: string;
    public hours: string;
    public img: string;
    public localStartTime: string;
    public localEndTime: string;
    public ptpStartTime: string;
    public ptpEndTime: string;
    public minutes: number;
    public month: string;
    public monthNum: number;
    public name: string;
    public profit: number;
    public risked: number;
    public roi: number;
    public roiStr: string;
    public skillName: string;
    public skillNumber: string;
    public start: string;
    public startDate: string;
    public totalMinutes: number;
    public weekday: string;
    public year: number;

    constructor(obj: any, id:number) {
        this.bankroll = obj.bankroll;
        this.breakMinutes = obj.breakMinutes;
        this.buyin = obj.buyin;
        this.cashout = obj.cashout;
        this.endTime = obj.endTime;
        this.food = obj.food;
        this.gameType = obj.gameType;
        this.id = obj.id || id;
        this.limit = obj.limit;
        this.location = obj.location;
        this.notes = obj.notes;
        this.rebuyAmount = obj.rebuyAmount;
        this.rebuys = obj.rebuys;
        this.stakes = obj.stakes;
        this.startTime = obj.startTime;
        this.status = obj.status;
        this.tips = obj.tips;
        this.tournamentFinish = obj.tournamentFinish;
        this.tournamentPaid = obj.tournamentPaid;
        this.tournamentSpots = obj.tournamentSpots;
        this.tournamentType = obj.tournamentType;
        this.type = obj.type;

        scrubGameAndCalculateProfit(obj);

        this.daytime = obj.daytime;
        this.end = obj.end;
        this.endDate = obj.endDate;
        this.gross = obj.gross;
        this.hourly = obj.hourly;
        this.hours = obj.hours;
        this.img = obj.img;
        this.ptpStartTime = obj.ptpStartTime;
        this.ptpEndTime = obj.ptpEndTime;
        this.localStartTime = obj.localStartTime;
        this.localEndTime = obj.localEndTime;
        this.minutes = obj.minutes;
        this.month = obj.month;
        this.monthNum = obj.monthNum;
        this.name = obj.name;
        this.profit = obj.profit;
        this.risked = obj.risked;
        this.roi = obj.roi;
        this.roiStr = obj.roiStr;
        this.skillName = obj.skillName;
        this.skillNumber = obj.skillNumber;
        this.start = obj.start;
        this.startDate = obj.startDate;
        this.totalMinutes = obj.totalMinutes;
        this.weekday = obj.weekday;
        this.year = obj.year;
    }

}
