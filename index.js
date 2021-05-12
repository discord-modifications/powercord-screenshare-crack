const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const User = getModule(['getCurrentUser'], false);

module.exports = class extends Plugin {
   startPlugin() {
      inject('screenshare-crack', User, 'getCurrentUser', (_, res) => {
         res['premiumType'] = 2;
         return res;
      });
   }

   pluginWillUnload() {
      uninject('screenshare-crack');
   }
};