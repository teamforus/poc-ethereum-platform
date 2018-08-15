
export class Toast {
    constructor(
        private _message: string,
        private _level: number
    ) { }

    private _timeout: number|false = false;
    set timeout(value:number) {
        if (!this._timeout) {
            this._timeout = value;
        }
    }

    public get className(): string {
        let ret = '';
        switch (this._level) {
            case ToastWarningLevels.LOW:
            case ToastWarningLevels.GREEN:
            case ToastWarningLevels.LOG:
                ret = 'green';
                break;
            case ToastWarningLevels.MEDIUM:
            case ToastWarningLevels.ORANGE:
            case ToastWarningLevels.WARNING:
                ret = 'orange';
                break;
            case ToastWarningLevels.HIGH:
            case ToastWarningLevels.RED:
            case ToastWarningLevels.ERROR:
                ret = 'red';
                break;
        }
        return ret
    }

    public clear() {
        if (!this._timeout) {
            clearTimeout(parseInt(this._timeout.toString()));
        }
    }

    public get message(): string { return this._message; }
}

export class ToastWarningLevels {
    static readonly LOW = 1;
    static readonly MEDIUM = 2;
    static readonly HIGH = 3;

    static readonly GREEN = 1;
    static readonly ORANGE = 2;
    static readonly RED = 3;

    static readonly LOG = 1;
    static readonly WARNING = 2;
    static readonly ERROR = 3;
}