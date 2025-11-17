export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        this.components = [...other];
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        const escapedComponents = this.components.map(comp => this.escapeComponent(comp));
        return escapedComponents.join(this.delimiter);
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Index ${i} out of bounds`);
        }
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Index ${i} out of bounds`);
        }
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error(`Index ${i} out of bounds`);
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Index ${i} out of bounds`);
        }
        this.components.splice(i, 1);
    }

    // helper escape
    private escapeComponent(component: string): string {
        let result = '';
        for (let i = 0; i < component.length; i++) {
            const char = component[i];
            if (char === this.delimiter || char === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }

    private unescapeComponent(escapedComponent: string): string {
        let result = '';
        let i = 0;
        while (i < escapedComponent.length) {
            const char = escapedComponent[i];
            if (char === ESCAPE_CHARACTER && i + 1 < escapedComponent.length) {
                result += escapedComponent[i + 1];
                i += 2;
            } else {
                result += char;
                i += 1;
            }
        }
        return result;
    }

    // static method parser
    public static parse(dataString: string, delimiter: string = DEFAULT_DELIMITER): Name {
        const components: string[] = [];
        let currentComponent = '';
        let i = 0;

        while (i < dataString.length) {
            const char = dataString[i];
            
            if (char === ESCAPE_CHARACTER && i + 1 < dataString.length) {
                currentComponent += dataString[i + 1];
                i += 2;
            } else if (char === delimiter) {
                components.push(currentComponent);
                currentComponent = '';
                i += 1;
            } else {
                currentComponent += char;
                i += 1;
            }
        }

        components.push(currentComponent);
        return new Name(components, delimiter);
    }

}
