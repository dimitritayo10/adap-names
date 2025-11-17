import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.noComponents = this.parseComponents().length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const components = this.parseComponents();
        return components.map(component => 
            component.replace(new RegExp(`([${this.escapeRegExp(delimiter + ESCAPE_CHARACTER)}])`, 'g'), 
                            `${ESCAPE_CHARACTER}$1`)
        ).join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const components = this.parseComponents();
        if (x < 0 || x >= components.length) {
            throw new Error("Index out of bounds");
        }
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        const components = this.parseComponents();
        if (n < 0 || n >= components.length) {
            throw new Error("Index out of bounds");
        }
        components[n] = c;
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public insert(n: number, c: string): void {
        const components = this.parseComponents();
        if (n < 0 || n > components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public append(c: string): void {
        const components = this.parseComponents();
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public remove(n: number): void {
        const components = this.parseComponents();
        if (n < 0 || n >= components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        const components = this.parseComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    private parseComponents(): string[] {
        const components: string[] = [];
        let currentComponent = "";
        let escaping = false;

        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];

            if (escaping) {
                currentComponent += char;
                escaping = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaping = true;
            } else if (char === this.delimiter) {
                components.push(currentComponent);
                currentComponent = "";
            } else {
                currentComponent += char;
            }
        }

        if (escaping) {
            currentComponent += ESCAPE_CHARACTER;
        }
        components.push(currentComponent);

        return components;
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}
