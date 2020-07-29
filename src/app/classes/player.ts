export class Player {
    public id: number;
    public name: string;
    public looseNum: number;
    public aggresiveNum: number;
    public skill: number;
    public comments: string;
    public casino: string;

    //derived
    public skillName: string;
    public label: string;
    public playerType: number;

    constructor(obj: any, id:number) {
        if (!obj)
            obj = {};

        this.id = obj.id || id || 1;
        this.name = obj.name || '';
        this.looseNum = obj.looseNum || 0;
        this.aggresiveNum = obj.aggresiveNum || 0;
        this.skill = obj.skill || 0;
        this.comments = obj.comments || '';
        this.casino = obj.casino || '-';

        var looseTight = (this.looseNum <= 50) ? 'Loose' : 'Tight';
        var passiveAgressive = (this.aggresiveNum <= 50) ? 'Passive' : 'Aggressive';
        this.label = looseTight + ' ' + passiveAgressive;

        var skills = ['Weak', 'Average', 'Strong', 'Pro'];
        this.skillName = skills[this.skill];

        var playerTypes = [0, 2, 4, 5];
        this.playerType = playerTypes[this.skill];

    }
}
