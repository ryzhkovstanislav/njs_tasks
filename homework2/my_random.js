class MyRandom {

    static oneOrTwoGetter() {
        let number = Math.random();
        if (number >= 0.5) return 2;
        else return 1;
    }
}

module.exports = MyRandom;
