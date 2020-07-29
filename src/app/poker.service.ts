import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PokerService {

	constructor() { }

	getDataOfType(type: number) {
		if (type == 0)
			return [
				{ name: 'Hold\'em', count: 1 },
				{ name: 'Omaha', count: 0 },
				{ name: 'Razz', count: 0 },
				{ name: '7-Card', count: 0 },
				{ name: '5-Card', count: 0 },
			];
		if (type == 1)
			return [
				{ name: 'Single Table', count: 1 },
				{ name: 'Multi Table', count: 1 },
				{ name: 'Heads up', count: 0 },
			];
		if (type == 2)
			return [
				{ name: '$1/$2', count: 1 },
				{ name: '$1/$3', count: 0 },
				{ name: '$3/$5', count: 0 },
				{ name: '$3/$6', count: 0 },
				{ name: '$5/$10', count: 0 },
			];
		if (type == 3)
			return [
				{ name: 'No-Limit', count: 1 },
				{ name: 'Limit', count: 0 },
				{ name: 'Spread', count: 0 },
				{ name: 'Pot-Limit', count: 0 },
			];
		if (type == 4) // banroll
			return [
				{ name: 'Default', count: 0 },
			];
		if (type == 5) // location
			return [
				{ name: 'Casino', count: 0 },
			];
		if (type == 6) // cash buyin
			return [
				{ name: '200', count: 0 },
			];
		if (type == 7) // tournament buyin
			return [
				{ name: '30', count: 0 },
			];
		return [];
	}
	getUserDataOfType(type: number, games: any[]) {
		var records: any[] = this.getDataOfType(type);
		var dataHash: any = {}
		records.forEach(record => {
			dataHash[record.name] = record.count;
		});
		games.forEach(game => {
			if (type == 0) {
				if (!dataHash[game.gameType])
					dataHash[game.gameType] = 1;
				else
					dataHash[game.gameType]++;
			}
			if (type == 1 && game.type == 'Tournament') {
				if (!dataHash[game.tournamentType])
					dataHash[game.tournamentType] = 1;
				else
					dataHash[game.tournamentType]++;
			}
			if (type == 2 && game.type == 'Cash') {
				if (!dataHash[game.stakes])
					dataHash[game.stakes] = 1;
				else
					dataHash[game.stakes]++;
			}
			if (type == 3) {
				if (!dataHash[game.limit])
					dataHash[game.limit] = 1;
				else
					dataHash[game.limit]++;
			}
			if (type == 4) {
				if (!dataHash[game.bankroll])
					dataHash[game.bankroll] = 1;
				else
					dataHash[game.bankroll]++;
			}
			if (type == 5) {
				if (!dataHash[game.location])
					dataHash[game.location] = 1;
				else
					dataHash[game.location]++;
			}
		});
		var k = Object.keys(dataHash);
		var finalRecords:any[] = [];
		k.forEach(element => {
			var count = dataHash[element];
			finalRecords.push({ name: element, count: count });
		});
		return finalRecords;
	}
	getDataTypes(type = 0, limit = 0, games: any) {
		var records = this.getUserDataOfType(type, games);
		records.sort((curr: any, next: any) => {
			return curr.count > next.count ? -1 : 1;
		});
		if (limit > 0) {
			var top3 = [];
			for (var x = 0; x < limit; x++)
				top3.push(records[x].name);
			top3.push('edit');

			return top3;
		}
		return records;
	}
	getTopDataType(type = 0, games: any) {
		var list = this.getDataTypes(type, 1, games);
		return list[0];
	}
}
