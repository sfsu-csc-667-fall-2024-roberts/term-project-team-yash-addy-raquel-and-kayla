export class EventEmitter<T extends { [K: string]: any }> {
    private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {};

    on<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(callback);
    }

    emit<K extends keyof T>(event: K, data: T[K]) {
        this.listeners[event]?.forEach(callback => callback(data));
    }
}
