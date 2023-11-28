export function convertDMSToDD(GPS: Array<number>, direction: String): number {
    let [degrees, minutes, seconds] = GPS;
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") {
        dd = -dd;
    }
    return dd;
}


export const Fraction = {
    a: 0,
    b: 0,
    d: "",
    e: 0,
    fraction: function (num1: number, num2: number) {
        Fraction.a = num1;
        Fraction.b = num2;
        Fraction.appointment();
    },
    appointment: function () { // 约分操作
        if (Fraction.a === 0 || Fraction.b === 1) return; // 如果分子是0或分母是1就不用约分了
        Fraction.e = Fraction.gcd(Fraction.a, Fraction.b);
        Fraction.a /= Fraction.e;
        Fraction.b /= Fraction.e;
    },
    toFraction: function () {
        Fraction.d = Fraction.a + "/" + Fraction.b;
        return Fraction.d
    },
    gcd: function (a: number, b: number): any { //欧几里德算法
        return b === 0 ? a : Fraction.gcd(b, a % b);
    },

};
