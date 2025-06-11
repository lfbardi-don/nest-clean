import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
    compareItems(a: number, b: number): boolean {
        return a === b;
    }
}

describe('Watched List', () => {
    it('should be able to create a watched list with initial items', () => {
        const list = new NumberWatchedList([1, 2, 3]);
        expect(list.getItems()).toEqual([1, 2, 3]);
    });

    it('should be able to add a new item to the list', () => {
        const list = new NumberWatchedList([1, 2, 3]);
        list.add(4);
        expect(list.getItems()).toEqual([1, 2, 3, 4]);
        expect(list.getNewItems()).toEqual([4]);
    });

    it('should be able to remove an item from the list', () => {
        const list = new NumberWatchedList([1, 2, 3]);
        list.remove(2);
        expect(list.getItems()).toEqual([1, 3]);
        expect(list.getRemovedItems()).toEqual([2]);
    });

    it('should be able to update the list', () => {
        const list = new NumberWatchedList([1, 2, 3]);
        list.update([1, 2, 4]);
        expect(list.getItems()).toEqual([1, 2, 4]);
        expect(list.getNewItems()).toEqual([4]);
        expect(list.getRemovedItems()).toEqual([3]);
    });

    it('should be able to add an item that has been removed', () => {
        const list = new NumberWatchedList([1, 2, 3]);
        list.remove(2);
        list.add(2);
        expect(list.getItems()).toHaveLength(3);
        expect(list.getNewItems()).toHaveLength(0);
        expect(list.getRemovedItems()).toHaveLength(0);
    });
});