function keyCounter(keyCb, statCb) {
    this.tKeys = 0;
    this.lastKeys = 0;
    this.interval = 500;
    this.startTime = 0;
    this.start = function () {
        this.startTime = new Date();
        window.addEventListener('keyup', function () {
            this.tKeys++;
            keyCb(this.tKeys);
        }.bind(this));
        setInterval(function () {
            const currentKeys = this.tKeys - this.lastKeys;
            this.lastKeys = this.tKeys;
            const ckpm = currentKeys * (60000 / this.interval);
            const TotalTime = (new Date() - this.startTime)
            const kpm = this.tKeys / (TotalTime / 60000);
            const data = {
                ckpm: ckpm,
                kpm: kpm
            };
            statCb(data);
        }.bind(this), this.interval);
    }



}

function updateGame(data) {
    const teamA = $('#teamA');
    teamA.find('.kpm').find('span').text(data.kpm);
    teamA.find('.ckpm').find('span').text(data.ckpm);
}

function chacker() {

    // socket.emit('chat message', $('#m').val());
    this.socket = null;
    this.team = '';
    this.name = '';
    this.start = function (options) {
        this.team = options.team;
        this.socket = io();
        this.socket.emit('newUser', options);
        this.socket.on('gameData', function (data) {
            console.log(data)
            updateGame(data.teams[options.team]);
        });

        const keyCount = new keyCounter(function () {}, function (data) {
            const teams = {};
            teams[this.team] = data;
            const gameData = {
                teams: teams
            }
            this.socket.emit('gameData', gameData);
            this.socket.emit('gameData', gameData);

        }.bind(this));
        keyCount.start();
    }
}