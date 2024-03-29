
class Board {

    public grid: ICell[][];
    public width: number;
    public height: number;

    constructor(width = 9, height = 7) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.initGrid();
    }

    public checkConnection(length: number): ICell[][] | null {
        if (length > this.width || length > this.height) return null;

        const connections: ICell[][] = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];

                const horizontal = this.checkConnectionAtCell(cell, length, 1, 0);
                if (horizontal) connections.push(horizontal);

                const vertical = this.checkConnectionAtCell(cell, length, 0, 1);
                if (vertical) connections.push(vertical);

                const diagonal1 = this.checkConnectionAtCell(cell, length, 1, 1);
                if (diagonal1) connections.push(diagonal1);

                const diagonal2 = this.checkConnectionAtCell(cell, length, 1, -1);
                if (diagonal2) connections.push(diagonal2);

            }
        }

        return connections ? connections : null;
    }

    public isFull(): boolean {
        let full = true;
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.state === null) full = false;
            });
        })
        return full;
    }

    private checkConnectionAtCell(cell: ICell, length: number, dx: number, dy: number, setConnected = true): ICell[] | null {
        if (cell.state === null) return null;

        const lengthY = cell.y + dy * length;
        const lengthX = cell.x + dx * length;

        if (lengthY > this.height || lengthY < 0 || lengthX > this.width || lengthX < 0) return null;

        const cells: ICell[] = [cell];

        for (let i = 1; i < length; i++) {
            const _cell = this.grid[cell.y + dy * i][cell.x + dx * i];

            if (_cell.state !== cell.state) {
                return null;
            }

            cells.push(_cell);
        }

        if (setConnected) this.setConnected(cells);
        return cells;
    }

    public setConnected(cells: ICell[]): void {
        cells.forEach(cell => {
            this.grid[cell.y][cell.x].connected = true;
        });
    }

    public getCell(x: number, y: number): ICell {
        return this.grid[y][x];
    }

    public move(cell: ICell, dx: number, dy: number): void {
        if (cell.x + dx < 0 || cell.x + dx >= this.width || cell.y + dy < 0 || cell.y + dy >= this.height) return;
        const _cell = this.grid[cell.y + dy][cell.x + dx];
        if (_cell.state !== null) return;
        _cell.state = cell.state;
        _cell.color = cell.color;
        _cell.connected = cell.connected;
        const oldCell = this.grid[cell.y][cell.x];
        oldCell.state = null;
        oldCell.color = '';
        oldCell.connected = false;
        return this.move(_cell, dx, dy);
    }

    public initGrid() {
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];

            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = {
                    x,
                    y,
                    state: null,
                    color: '',
                    connected: false,
                };
            }
        }
    }

}


export default Board;