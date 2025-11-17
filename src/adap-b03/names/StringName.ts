import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter || DEFAULT_DELIMITER);
        this.name = source;
        this.noComponents = this.parseComponentCount();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name;
    }

    public asDataString(): string {
        return this.name;
    }

    public isEqual(other: Name): boolean {
        return this.asString() === other.asString();
    }

    public getHashCode(): number {
        let hash = 0;
        for (let i = 0; i < this.name.length; i++) {
            hash = ((hash << 5) - hash) + this.name.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.parseComponents();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.parseComponents();
        components[i] = c;
        this.name = this.rebuildString(components);
        this.noComponents = components.length;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.name = this.rebuildString(components);
        this.noComponents = components.length;
    }

    public append(c: string) {
        const components = this.parseComponents();
        components.push(c);
        this.name = this.rebuildString(components);
        this.noComponents = components.length;
    }

    public remove(i: number) {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.parseComponents();
        components.splice(i, 1);
        this.name = this.rebuildString(components);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        const otherString = other.asString(this.delimiter);
        if (this.name.length === 0) {
            this.name = otherString;
        } else if (otherString.length > 0) {
            this.name += this.delimiter + otherString;
        }
        this.noComponents = this.parseComponentCount();
    }

    private parseComponentCount(): number {
        if (this.name.length === 0) return 0;
        let count = 1;
        let escaped = false;
        
        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];
            if (escaped) {
                escaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (char === this.delimiter) {
                count++;
            }
        }
        return count;
    }

    private parseComponents(): string[] {
        if (this.name.length === 0) return [];
        
        const components: string[] = [];
        let currentComponent = '';
        let escaped = false;
        
        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];
            
            if (escaped) {
                currentComponent += char;
                escaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (char === this.delimiter) {
                components.push(currentComponent);
                currentComponent = '';
            } else {
                currentComponent += char;
            }
        }
        
        components.push(currentComponent);
        return components;
    }

    private rebuildString(components: string[]): string {
        return components.map(comp => 
            comp.replace(new RegExp(`[${this.delimiter}${ESCAPE_CHARACTER}]`, 'g'), 
                        `${ESCAPE_CHARACTER}$&`)
        ).join(this.delimiter);
    }
}
