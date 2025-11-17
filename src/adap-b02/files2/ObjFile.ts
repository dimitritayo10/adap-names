import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    private opened: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
    }

    public isOpen(): boolean {
      return this.opened;
    }
  
    public isClosed(): boolean {
        return !this.opened;
    }
  
    public open(): void {
      this.assertIsClosedFile();
      this.opened = true;
    }

    public read(): Object[] {
      this.assertIsOpenFile();
      const result = [...this.data];
      this.data = [];
      this.length = 0;
      return result;
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
      this.data = [...data];
      this.length = data.length;
    }
  
    public close(): void {
      this.assertIsOpenFile();
      this.opened = false;
    }

    public delete(): void {
      this.assertIsClosedFile();
      this.data = [];
      this.length = 0;
    }

    protected assertIsOpenFile(): void {
        if (!this.isOpen()) {
            throw new Error("File must be open for this operation");
        }
    }

    protected assertIsClosedFile(): void {
        if (!this.isClosed()) {
            throw new Error("File must be closed for this operation");
        }
    }

}