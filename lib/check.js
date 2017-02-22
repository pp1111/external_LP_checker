'use strict'

const request = require('request');
const util = require('util');
const os = require('os');
const logger = require('./logger');

class Ping {
    constructor (opts) {
        this.website = '';
        this.interval = 30;
        this.handle = null;
        this.mailer = opts.mailer;
        this.retryLimit = opts.retryLimit;
        this.retryCount = 0;
        this.server = {
            status: true,
            lastStatus: true
        }
        this.logInfoIfNeeded = {
            readyToLog: true,
            message: '',
            lastmessage: '',
        }
        this.onTick = opts.onTick;
        this.init(opts);
    }

    init (opts) {
        this.website = opts.website;
        this.interval = opts.interval * 1000;
        this.start();
    }
    start () {
        const self = this;
        let time = Date.now();
        self.ping();
        self.handle = setInterval( () => {
            self.ping();
        }, self.interval);
    }
    ping () {
        this.server.lastStatus = this.server.status;
        request(this.website, { timeout: 5000, followRedirect: false }, (error, res, body) => {
            console.log(body);
            if (!error && res.statusCode === 200) {
                this.isOk();
            } else {
                if (!error) {
                    if (res.statusCode !== 200) {
                        error = "Reason: statusCode " + res.statusCode;
                    } else {
                        logger.info("should not get here");
                    }
                }
                this.isNotOk([error]);
            }
            this.onTick(this.server.status, this.website, error, this.logInfoIfNeeded);
        });
        this.logInfoIfNeeded.readyToLog = false;
    }
    isOk () {
        let time = Ping.getFormatedDate(Date.now());
        this.server.status = 1;
        this.logInfo('OK', '');
    }
    isNotOk (error) {
        let time = Ping.getFormatedDate(Date.now());
        this.server.status = 0;
        this.logInfo('DOWN', error);
    }
    logInfo (status, err) {
        let time = Ping.getFormatedDate(Date.now());
        this.logInfoIfNeeded.message = `Server: ${this.website}, Status: ${status} ${err}`

        if (this.logInfoIfNeeded.message !== this.logInfoIfNeeded.lastmessage) {
            this.logInfoIfNeeded.readyToLog = true;
        }

        this.logInfoIfNeeded.lastmessage = this.logInfoIfNeeded.message;
    }
    static getFormatedDate (time) {
        let currentDate = new Date(time);
        currentDate = currentDate.toISOString();
        currentDate = currentDate.replace(/T/, ' ');
        currentDate = currentDate.replace(/\..+/, '');
        return currentDate + " UTC";
    }
}

module.exports = Ping;