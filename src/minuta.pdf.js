const pdf = require('html-pdf');
const html = require('./minuta.export');
const fs = require('fs');

class Minuta {
    constructor(own, participants, writter, duration, date, id) {
        this.daily = {
            own: own,
            participants: participants,
            writter: writter,
            duration: duration,
            date: date,
            id: id
        }

    }

    write() {
        pdf.create(html(this.daily)).toFile(`./minutas/${this.daily.date.date}-${this.daily.date.time.replace(/\:/g, "_")}.pdf`, (err, f) => {

            if (err)
                console.log(err.message);
            if (f)
                console.log("LISTIO", f.filename);
        })
    }
}

exports.Minuta = Minuta;