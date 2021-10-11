const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const { Plugin } = require('powercord/entities');
const Lodash = window._;

const Emoji = getModule(['isEmojiDisabled'], false);
const User = getModule(['getCurrentUser'], false);
const Guild = getModule(['getLastSelectedGuildId'], false);

module.exports = class ScreenshareCrack extends Plugin {
   startPlugin() {
      inject('screenshare-crack', User, 'getCurrentUser', (_, res) => {
         if (res) {
            res = Lodash.cloneDeep(res);
            res.originalPremiumType = res.premiumType;
            res.premiumType = 2;
         }

         return res;
      });

      inject('is-emoji-disabled', Emoji, 'isEmojiDisabled', ([emoji, channel], res) => {
         const user = User.getCurrentUser();
         const guild = Guild.getGuildId();

         if (user?.originalPremiumType > 0) return res;

         if (!emoji.guildId || (guild == emoji.guildId && !emoji.animated && user?.originalPremiumType != 0)) {
            return false;
         }

         return true;
      });
   };

   pluginWillUnload() {
      uninject('screenshare-crack');
      uninject('is-emoji-disabled');
   }
};