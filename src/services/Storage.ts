export interface Storage<T> {
  getAll(): Promise<T[]>
  save?(instance: T): Promise<T>
  delete?(instance: T): Promise<void>
}
