export class Arr<T> {
  arr: T[];
  next: number;

  constructor(initSize: number) {
    this.arr = Array(initSize);
    this.next = 0;
  }

  empty() {
    this.next = 0;
  }

  push(element: T) {
    if (this.next === this.arr.length) {
      this.arr[this.arr.length * 2 - 1] = undefined as any;
    }
    this.arr[this.next] = element;
    this.next++;
  }

  at(index: number) {
    return this.arr[index];
  }

  length() {
    return this.next;
  }
}
