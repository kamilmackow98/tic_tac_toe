export class Morpion {
  public player1: Player;
  public player2: Player;
  public current_player: Player;
  public size: number;
  public grid: string[];
  public moves: number;
  public winArray: Array<string[]>;
  public win: boolean;
  public tie: boolean;

  constructor(size: number, player1: string, player2: string) {
    this.player1 = new Player(player1, 0);
    this.player2 = new Player(player2, 0);
    this.current_player = this.player1;
    this.size = size;
    this.grid = [];
    this.moves = 0;

    this.winArray = [];
    this.win = false;
    this.tie = false;
  }

  MODE = "MODE_COMPLET";

  public gridSize(): number {
    return this.size * this.size;
  }

  public initGrid(): void {
    this.grid = Array(this.gridSize()).fill("");
  }

  public nextPlayer(): void {
    this.current_player === this.player1 ? (this.current_player = this.player2) : (this.current_player = this.player1);
  }

  public nextMove(): string {
    this.moves++;
    return this.current_player === this.player1 ? "O" : "X";
  }

  public updateScore(): void {
    this.current_player === this.player1 ? this.player1.score++ : this.player2.score++;
  }

  public checkWin(): void {
    this.winArray = [...this.getColumns(), ...this.getRows()];
    this.winArray.push(this.getDiagTL());
    this.winArray.push(this.getDiagTR());

    this.winArray.forEach((arr) => {
      if (arr.every((symbol: string) => symbol === arr[0] && symbol !== "")) {
        this.win = true;
      }
    });

    if (this.moves === this.gridSize() && !this.win) {
      this.tie = true;
    }

    if (this.win) {
      this.updateScore();
    }
  }

  public reset(): void {
    this.win = false;
    this.tie = false;
    this.moves = 0;
    this.grid = [];
    this.winArray = [];
    this.current_player = this.player1;
  }

  public getColumns(): Array<string[]> {
    const columns = [];

    for (let i = 0; i < this.size; i++) {
      let startIdx = i;
      const col = [];

      for (let j = 0; j < this.size; j++) {
        col.push(this.grid[startIdx]);
        startIdx += this.size;
      }
      columns.push(col);
    }

    return columns;
  }

  public getRows(): Array<string[]> {
    return Array.from({ length: Math.ceil(this.grid.length / this.size) }, (v, i) =>
      this.grid.slice(i * this.size, i * this.size + this.size)
    );
  }

  public getDiagTL(): string[] {
    const diag = [];
    let idx = 0;

    for (let i = 0; i < this.size; i++) {
      diag.push(this.grid[idx]);
      idx += this.size + 1;
    }

    return diag;
  }

  public getDiagTR(): string[] {
    const diag = [];
    let idx = this.size - 1;

    for (let i = 0; i < this.size; i++) {
      diag.push(this.grid[idx]);
      idx += this.size - 1;
    }

    return diag;
  }
}

/* ------------------------------ */
/* ------| MORPION SIMPLE |------ */
/* ------------------------------ */

export class MorpionSimple extends Morpion {
  constructor(size: number, player1: string, player2: string) {
    super(size, player1, player2);
  }

  MODE = "MODE_SIMPLE";

  public checkWin(): void {
    let hor_ver_win = false;

    this.winArray = [...this.getColumns(), ...this.getRows()];
    
    this.winArray.forEach((arr) => {
      const combination = arr.join("-");

      if (combination.includes("O-O-O") || combination.includes("X-X-X")) {
        hor_ver_win = true;
      }
    });

    const diagonalWin = this.checkDiagonals();

    if (this.moves === this.gridSize() && !this.win) {
      this.tie = true;
    }

    if (hor_ver_win || diagonalWin) {
      this.updateScore();
      this.win = true;
    }
  }

  public checkDiagonals(): boolean {
    const indexes = this.getMiddleSquare();
    let check = false;

    indexes.forEach((index) => {
      const bottom = index + this.size; // Cell under the current cell
      const top = index - this.size; // Cell above the current cell

      const diagTL = top - 1; // Diagonal value top left
      const diagBR = bottom + 1; // Diagonal value bottom right

      const diagTR = top + 1; // Diagonal value top right
      const diagBL = bottom - 1; // Diagonal value bottom left

      const current = this.grid[index];
      const notEmpty = current !== "";

      const diag1Win = notEmpty && current === this.grid[diagTL] && current === this.grid[diagBR];
      const diag2Win = notEmpty && current === this.grid[diagTR] && current === this.grid[diagBL];

      if (diag1Win || diag2Win) {
        check = true;
      }
    });

    return check;
  }

  public getMiddleSquare(): number[] {
    const border = this.size - 2; // 2 since there is always 2 borders (left border and right border)
    const indexes = [];
    let idx = 0;

    // (size + 1) allows to skip top border of the grid and (arr.length - size - 1) skips the bottom border
    for (let i = this.size + 1; i < this.grid.length - this.size - 1; i++) {
      if (idx === border) {
        i++; // Skips two indexes (borders of the grid)
        idx = 0; // Reset idx
      } else {
        indexes.push(i);
        idx++;
      }
    }

    return indexes;
  }
}

/* ---------------------------- */
/* ------| PLAYER CLASS |------ */
/* ---------------------------- */

export class Player {
  public name: string;
  public score: number;

  constructor(name: string, score: number) {
    this.name = name;
    this.score = score;
  }
}
