// getLevelNumber.js
export function getLevelNumber(level) {
    switch (level) {
        case "débutant":
            return 1;
        case "intermediare":
            return 2;
        default:
            return 3;
    }
}

export default getLevelNumber;
