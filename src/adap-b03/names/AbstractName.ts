import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        throw new Error("Method 'clone()' must be implemented in subclass");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("Method 'asString()' must be implemented in subclass");
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        throw new Error("Method 'asDataString()' must be implemented in subclass");
    }

    public isEqual(other: Name): boolean {
        throw new Error("Method 'isEqual()' must be implemented in subclass");
    }

    public getHashCode(): number {
        throw new Error("Method 'getHashCode()' must be implemented in subclass");
    }

    public isEmpty(): boolean {
        throw new Error("Method 'isEmpty()' must be implemented in subclass");
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        throw new Error("Method 'concat()' must be implemented in subclass");
    }

}
