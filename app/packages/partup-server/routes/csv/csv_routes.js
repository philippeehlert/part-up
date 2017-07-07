var path = Npm.require('path');
var Busboy = Npm.require('busboy');

var MAX_FILE_SIZE = 1000 * 1000 * 10; // 10 MB

Router.route('/csv/parse', {where: 'server'}).post(function() {
    var request = this.request;
    var response = this.response;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var busboy = new Busboy({'headers': request.headers});

    busboy.on('file', Meteor.bindEnvironment(function(fieldname, file, filename, encoding, mimetype) {
        var extension = path.extname(filename);

        if (!(/\.(csv)$/i).test(extension)) {
            response.statusCode = 400;
            // TODO: Improve error message (i18n)
            response.end(JSON.stringify({error: {reason: 'error-csvupload-invalidcsv'}}));
            return;
        }

        var baseFilename = path.basename(filename, extension);

        var size = 0;
        var buffers = [];

        file.on('data', Meteor.bindEnvironment(function(data) {
            size += data.length;
            buffers.push(new Buffer(data));
        }));

        file.on('end', Meteor.bindEnvironment(function() {
            if (size > MAX_FILE_SIZE) {
                response.statusCode = 400;
                // TODO: Improve error message (i18n)
                response.end(JSON.stringify({error: {reason: 'error-csvupload-toolarge'}}));
                return;
            }

            var body = Buffer.concat(buffers);

            // Check what delimiter is used
            var delimiter = (body.indexOf(";") === -1) ? "," : ';'

            CSV()
                .from.string(body, {
                        delimiter: delimiter, // Set the field delimiter. One character only, defaults to comma.
                        skip_empty_lines: true, // Don't generate empty values for empty lines.
                        trim: true // Ignore whitespace immediately around the delimiter.
                    })
                .to.array(Meteor.bindEnvironment(function(array) {
                    var list = lodash.chain(array)
                        .map(function(row) {

                            if (row.length != 2) return false;

                            var name = row[0].trim()
                            var email = row[1].toLowerCase()

                            if (!Partup.services.validators.email.test(email)) return false;

                            return {
                                name: name,
                                email: email
                            };
                        })
                        .compact()
                        .uniq(function(row) {
                            return row.email;
                        })
                        .value();

                    // Limit to 200 email addresses
                    if (list.length > 200) {
                        response.statusCode = 400;
                        // TODO: Improve error message (i18n)
                        response.end(JSON.stringify({error: {reason: 'error-csvupload-toolarge'}}));
                        return;
                    }

                    response.end(JSON.stringify({error: false, result: list}));
                }))
                .on('error', function(error) {
                    response.statusCode = 400;
                    // TODO: Improve error message (i18n)
                    response.end(JSON.stringify({error: {reason: 'error-csvupload-invalidcsv'}}));
                    return;
                });
        }));
    }));

    request.pipe(busboy);
});

Router.route('/csv/admin/users', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;

    if(!request.user) {
        response.statusCode = 403;
        response.end(JSON.stringify({error: {reason: 'error-unauthorized'}}));
        return;
    }

    if(!User(request.user).isAdmin()) {
        response.statusCode = 403;
        response.end(JSON.stringify({error: {reason: 'error-unauthorized'}}));
        return;
    }
    response.setHeader('Content-disposition', 'attachment; filename=userdump.csv');
    response.setHeader('Content-type', 'text/csv');

    return exportCSV(response);
});

Router.route('/csv/tribe/uppers', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;

    if (!request.query.id || !request.user) {
        response.statusCode = 403;
        response.end(JSON.stringify({error: {reason: 'error-unauthorized'}}));
        return;
    }

    var network = Networks.findOneOrFail(request.query.id);
    if (!network.isAdmin(request.user._id)) {
        response.statusCode = 403;
        response.end(JSON.stringify({error: {reason: 'error-unauthorized'}}));
        return;
    }

    response.setHeader('Content-disposition', 'attachment; filename=tribe-uppers.csv');
    response.setHeader('Content-type', 'text/csv');

    return exportCSV(response, network.uppers, true);
});

var exportCSV = function(responseStream, userIds, ignoreDeactivatedUsers) {
    userIds = userIds || [];
    var userStream = createStream();
    var Future = Npm.require('fibers/future');
    var fut = new Future();
    var users = {};
    var userSelector = userIds.length > 0 ? {_id: {$in: userIds}} : {};

    if (ignoreDeactivatedUsers) {
        userSelector.deactivatedAt = {$exists: false};
    };

    CSV()
        .from(userStream)
        .to(responseStream, {delimiter:';'})
        .on('error', function(error){
            console.error('Error streaming CSV export: ', error.message);
        })
        .on('end', function(count){
            responseStream.end();
            fut.return();
        });
    if (ignoreDeactivatedUsers) {
        userStream.write(['user id','name','phonenumber','e-mail','member since']);
    } else {
        userStream.write(['_id','profile.name','profile.phonenumber','registered_emails','createdAt','deactivatedAt']);
    }
    users = Meteor.users.findForAdminList(userSelector, {}).fetch();

    var count = 0;
    users.forEach(function(user) {
        var objectUser = User(user);
        var createdAt = user.createdAt ? moment(new Date(user.createdAt)).format('DD-MM-YYYY') : undefined;
        if (ignoreDeactivatedUsers) {
            userStream.write([
                user._id,
                user.profile.name,
                user.profile.phonenumber,
                objectUser.getEmail(),
                createdAt
            ]);
        } else {
            var deactivatedAt = user.deactivatedAt ? moment(new Date(user.deactivatedAt)).format('DD-MM-YYYY') : undefined;
            userStream.write([
                user._id,
                user.profile.name,
                user.profile.phonenumber,
                objectUser.getEmail(),
                createdAt,
                deactivatedAt
            ]);
        }
        count++;
        if (count >= users.length) {
            userStream.end()
        }
    });

    return fut.wait();
};

//Creates and returns a Duplex(Read/Write) Node stream
//Used to pipe users from .find() Cursor into our CSV stream parser.
var createStream = function(){
    var stream = Npm.require('stream');
    var myStream = new stream.Stream();
    myStream.readable = true;
    myStream.writable = true;

    myStream.write = function (data) {
        myStream.emit('data', data);
        return true; // true means 'yes i am ready for more data now'
        // OR return false and emit('drain') when ready later
    };

    myStream.end = function (data) {
        //Node convention to emit last data with end
        if (arguments.length)
            myStream.write(data);

        // no more writes after end
        myStream.writable = false;
        myStream.emit('end');
    };

    myStream.destroy = function () {
        myStream.writable = false;
    };

    return myStream;
};
