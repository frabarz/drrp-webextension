(function (DR) {
    "use strict";

    if (document.title.toLowerCase().indexOf('signup') == -1)
        return;

    var trials = [];

    trials[0] = DR.getThreadSource()
        .then(currentExtractor);

    trials[1] = DR.fetch('GET', 'https://frbrz-kumo.appspot.com/postit/participation.json')
        .then(historyCruncher);

    Promise.all(trials)
        .then(priorityCalculator)
        .then(console.log.bind(console));

    function currentExtractor(source) {
        var seen = {};

        return source[1].data.children
            .filter(function (reply) {
                return seen.hasOwnProperty(reply.data.author) ? false : (seen[reply.data.author] = true);
            })
            .sort(function (a, b) {
                return a.data.created_utc - b.data.created_utc;
            })
            .map(function (reply, index) {
                return {
                    order: index,
                    post: reply.data.id,
                    created: reply.data.created_utc,
                    username: reply.data.author,
                    body: reply.data.body
                };
            })
            .reduce(function (list, signup) {
                list[signup.username.toLowerCase()] = signup;
                return list;
            }, {});
    }

    function historyCruncher(list) {
        list.reverse();

        return list.reduce(function (userlist, trial) {
            var u, user,
                players = (trial.players || '').split(','),
                reserve = (trial.reserve || '').split(',');

            for (u = 0; user = players[u]; u++) {
                user = user.toLowerCase();

                if (!userlist.hasOwnProperty(user))
                    userlist[user] = {
                        user: players[u],
                        main: 0,
                        reserve: 0,
                        lastMain: list.length,
                        lastReserve: list.length
                    };

                if (userlist[user].lastMain == trial.number) {
                    userlist[user].main += 1;
                    userlist[user].lastMain -= 1;
                }
            }

            for (u = 0; user = reserve[u]; u++) {
                user = user.toLowerCase();

                if (!userlist.hasOwnProperty(user))
                    userlist[user] = {
                        user: reserve[u],
                        main: 0,
                        reserve: 0,
                        lastMain: list.length,
                        lastReserve: list.length
                    };

                if (userlist[user].lastReserve == trial.number) {
                    userlist[user].reserve += 1;
                    userlist[user].lastReserve -= 1;
                }
            }

            return userlist;
        }, {});
    }

    function priorityCalculator(result) {
        function leadingZero(num) {
            return ('000' + num).slice(-3);
        }

        return Object.keys(result[0])
            .map(function (userkey) {
                var user = result[0][userkey],
                    prev = result[1][userkey];

                user.counter = 0;

                if (prev) {
                    user.counter += (prev.main - prev.reserve);
                    user.main = prev.main;
                    user.reserve = prev.reserve;

                } else {
                    user.counter -= 1;
                }

                user.hash = [100 + user.order + user.counter, 100 + user.counter].map(leadingZero).join('-');

                return user;
            })
            .sort(function (a, b) {
                return a.hash.localeCompare(b.hash);
            })
            .map(function (s) {
                return [s.order, s.main, s.reserve].map(leadingZero).join(' ') + ' ' + s.hash + ' ' + s.username;
            });
    }

})(window.DRreddit);

