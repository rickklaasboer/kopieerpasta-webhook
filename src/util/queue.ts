class Queue<T> {
    items: T[];

    constructor(params: T[]) {
        this.items = [...params];
    }

    push(val: T) {
        if (this.getLength() > 10) this.pop();

        this.items.push(val);
    }

    pop(): T | undefined {
        return this.items.shift();
    }

    containsItem(item: T): boolean {
        return this.items.includes(item);
    }

    getLength(): number {
        return this.items.length;
    }

    getItems(): T[] {
        return this.items;
    }
}
