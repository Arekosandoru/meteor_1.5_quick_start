Meteor.methods({
  get_emails: function () {
    var Imap = require('imap');
    var inspect = require('util').inspect;
    var tls = require('tls');
    var email = '';
    tls.checkServerIdentity = function () {
        return false;
    };
    // Any code running on the server-side needs to be contained within a Fiber otherwise we will get an Error
    // The function returned from Meteor.bindEnvironment automatically gets run in a Fiber
    var createNewEmail = Meteor.bindEnvironment(function(isPermanent,message,subject,email,inbound_date,delayedHours) {
        Meteor.call('create_blacklist_email', isPermanent,message,subject,email,inbound_date,delayedHours, function(err) { 
            if (err) {
                console.log(err);
                return;
            }
        });
    }, function(err) {
        throw new Meteor.Error(err.toString());
    });
    var imap = new Imap({
        user: 'noreply@sitename.io',
        password: 'nGCcABUCOmUL1724!',
        host: 'mail.sitename.io',
        port: 993,
        tls: true,
        keepalive: false
    });
    SyncedCron.add({
      name: 'Check unseen emails',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 hours');
      },
      job: function() {
        function openInbox(cb) {
            // The second parameter is for opening the inbox in read mode only
            // Setting it to "false" opens the box in read-write mode
            // We need that mode so we can set the message to "SEEN" after we save it in the DB
            imap.openBox('INBOX', false, cb);
        }

        imap.once('ready', function() {
            openInbox(function(err, box) {
                if (err) {
                    throw new Meteor.Error(err.toString());
                }

                // Change to 'ALL' to get all emails
                imap.search(['UNSEEN'], function(err, results) {
                    var messages = [];
                    if (err) {
                        throw new Meteor.Error(err.toString());
                    };
                    // If results is empty array JS will throw error: Nothing to fetch
                    if (results.length === 0) {
                        console.log('No unseen emails');
                        return;
                    }
                    var imapFetch = imap.fetch(results, {
                        id: 1,
                        bodies: [ 'HEADER.FIELDS (FROM TO SUBJECT)', '1'],
                        struct: true,
                        markSeen: true
                    });
                    imapFetch.on('message', function(msg, seqno) {
                        var header = '';
                        var body = '';
                        var parsedMsg = {};

                        msg.on('body', function(stream, info) {
                            var buffer = '', count = 0;

                            if (info.which === 'TEXT' || info.which === '1' ) {
                                stream.on('data', function(chunk) {
                                    body += chunk.toString('utf8')
                                });
                                stream.once('end', function() {
                                     parsedMsg.body = body;
                                });

                            } else {
                                stream.on('data', function(chunk) {
                                    header += chunk.toString('utf8')
                                });
                                stream.once('end', function() {
                                    parsedMsg.header = Imap.parseHeader(header)
                                });
                            }
                        });

                        msg.once('attributes', function(attrs) {
                            parsedMsg.attrs = attrs;
                        });

                        msg.once('end', function() {
                            messages.push(parsedMsg);
                        });
                    });

                    imapFetch.once('error', function(err) {
                        throw new Meteor.Error('Fetch error:  '  + err.toString());
                    });

                    imapFetch.once('end', function() {
                        var from = '';
                        var subject = '';
                        var body = '';
                        var date = '';
                        var id = null;
                        var answer = '';
                        var getEmailRegex = /[_a-z0-9\-]+(\.[a-z0-9_\-]+)*@[a-z0-9]+(\.[a-z0-9_-]+)*(\.[a-z]{2,4})/;
                        var delayRegex = /delayed (.*?) hours/;
                        var email_address,delayHours,permanent;
                        for(i in messages) {
                          answer = '';
                          id = null;
                          from = messages[i].header.from.toString();
                          subject = messages[i].header.subject.toString().replace(/Unread/g, '');
                          body = messages[i].body.toString().replace(/Unread/g, '');
                          date = messages[i].attrs.date;
                          email_address = getEmailRegex.exec(body)[0];
                          date = moment(date).toDate();
                          if (from.match('Mail Delivery System')/*'Mail Delivery System <Mailer-Daemon@web1.hostingserver123.com>'*/) {
                            //var exists = blacklistedEmails.findOne({email:email});
                            if (subject.match('Mail delivery failed')/*== 'Mail delivery failed: returning message to sender'*/) {
                              permanent = body.match('This is a permanent error');
                              if (permanent) {
                                /*if (exists) {
                                  blacklistedEmails.update_email(exists._id,true,body,subject,date);
                                }else {*/
                                  
                                  createNewEmail(true,body,subject,email_address,date);
                                  
                                //}  
                              }
                            }else {
                              permanent = body.match('This is a permanent error');
                              if (permanent) {
                                createNewEmail(true,body,subject,email_address,date);
                              }else {
                                delayHours = subject.match(delayRegex)[1];
                                delayHours = Number(delayHours);
                                //if (exists) {
                                  //blacklistedEmails.update_email(exists._id,false,body,subject,date,delayHours);
                                //}else {
                                  createNewEmail(false,body,subject,email_address,date,delayHours);
                                //}
                                
                              }
                            }
                          }  
                        }
                        imap.end();
                    });
                });
            });
        });
        imap.once('error', function(err) {
            //throw new Meteor.Error(err.toString());
        });
        imap.once('end', function() {
          console.log('Connection ended');
        });
        imap.connect();
      }
    });
  }
});