class Position {
    constructor(col, row, sizex, sizey) {
        this.col = col;
        this.row = row;
        this.sizex = sizex;
        this.sizey = sizey;
    }
}

class Service {
    constructor(name, options, Position,) {
        this.service = name;
        this.options = options;
        this.positions = Position;
    }
}

if (typeof module !== 'undefined') {
    module.exports = {
        Service: Service,
        Position: Position,
    };
}