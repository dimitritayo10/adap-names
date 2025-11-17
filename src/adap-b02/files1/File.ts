export class File {

    private opened: boolean = false;

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
      return [];
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
    }
  
    public close(): void {
      this.assertIsOpenFile();
      this.opened = false;
    }

    public delete(): void {
      this.assertIsClosedFile();
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