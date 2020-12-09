export class UnauthorizedException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}