export class Queue<T> {
  private queue: T[] = []
  private lastPopped?: T

  public push(value: T) {
    this.queue.unshift(value)
  }

  public pop() {
    if (this.queue.length) {
      this.lastPopped = this.queue.pop()
    }
  }

  public getCurrent() {
    return this.queue[this.queue.length - 1]
  }

  public getLastPopped() {
    return this.lastPopped
  }

  public getLength() {
    return this.queue.length
  }
}
