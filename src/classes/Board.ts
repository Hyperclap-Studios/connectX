
class Board {

    public grid: ICell[][];
    public width: number;
    public height: number;

    constructor(width: number = 7, height: number = 5) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.initGrid();
    }

    public checkConnection(length: number): ICell[][] | null {
        if (length > this.width || length > this.height) return null;

        let connections: ICell[][] = [];

        for (let y = 0; y < this.height - length + 1; y++) {
            for (let x = 0; x < this.width - length + 1; x++) {
                const cell = this.grid[y][x];

                const horizontal = this.checkConnectionAtCell(cell, length, 1, 0);
                if (horizontal) connections.push(horizontal);

                const vertical = this.checkConnectionAtCell(cell, length, 0, 1);
                if (vertical) connections.push(vertical);

                const diagonal = this.checkConnectionAtCell(cell, length, 1, 1);
                if (diagonal) connections.push(diagonal);

            }
        }

        return connections ? connections : null;
    }

    private checkConnectionAtCell(cell: ICell, length: number, dx: number, dy: number, setConnected: boolean = true): ICell[] | null {
        if (cell.state === null) return null;

        let cells: ICell[] = [cell];

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