/// <reference path="./Array.d.ts" />
Array.prototype.random = function <T>(): T | undefined {
    return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.shuffle = function <T>(): T[] {
    return this.sort(() => Math.random() - 0.5)
}
