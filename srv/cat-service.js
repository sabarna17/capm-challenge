

module.exports = async (srv) => {
    // const {Holes} = cds.entities ('golfRounds')
    
    var cds = require('@sap/cds');
    const remote = await cds.connect.to('remoteService');

    var result = function (score, par) {
        if (score == 1) {
            return 'Hole in One';
        }
        else {
            var calculated = score - par;
            switch (calculated) {
                case -3: return 'albatross'
                case -2: return 'eagle'
                case -1: return 'birdie'
                case 0: return 'par'
                case 1: return 'bogey'
                case 2: return 'double bogey'
                case 3: return 'triple bogey'
                default: return 'NA'
            }
        }
    }

    srv.on('*', 'Players', (req) => {
        console.log('>> delegating to remote service...')
        return remote.run(req.query)
    })

    srv.after('READ', 'Holes', async holes => {
        try {
            console.log(holes.length);
            for (var i = 0; i < holes.length; i++) {
                var hole = holes[i];
                console.log('I am here', hole['ID']);
                let query = SELECT`count(*) as COUNT`.from`CatalogService.Shots`.where(`hole_ID='${hole['ID']}'`)
                let score = await cds.db.run(query)
                console.log('This is my score', score[0]);
                hole.score = score[0]['COUNT'];
                hole.result = result(hole.score, hole.par);
            }
        }
        catch (err) {
            // Do Nothing
        }
    })

    srv.after('READ', 'Rounds', async rounds => {
        try {
            for (var i = 0; i < rounds.length; i++) {
                var round = rounds[i];
                // console.log(round['holes']);
                for (var j = 0; j < round['holes'].length; j++) {
                    var hole = round['holes'][j]
                    let query = SELECT`count(*) as COUNT`.from`CatalogService.Shots`.where(`hole_ID='${hole['ID']}'`)
                    let score = await cds.db.run(query)
                    hole.score = score[0]['COUNT'];
                    hole.result = result(hole.score, hole.par);
                }
            }
        }
        catch (err) {
            // Do Nothing
        }
    })
}