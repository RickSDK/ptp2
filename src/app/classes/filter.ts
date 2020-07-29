export class Filter {
    public id: number;
    public name: string;
    public type: string;
    public dateRange: string;
    public tournamentType: string;
    public stakes: string;
    public limit: string;
    public bankroll: string;
    public casino: string;
    public displayFlg: boolean;

    constructor(obj: any, id:number=0) {
        if (!obj)
            obj = {};

        this.id = obj.id || id;
        this.name = obj.name || '';
        this.type = obj.type || 'All';
        this.dateRange = obj.dateRange || 'All';
        this.tournamentType = obj.tournamentType || 'All';
        this.stakes = obj.stakes || 'All';
        this.limit = obj.limit || 'All';
        this.bankroll = obj.bankroll || 'All';
        this.bankroll = obj.bankroll || 'All';
        this.casino = obj.casino || 'All';
        this.displayFlg = obj.displayFlg || true;
    }
}


