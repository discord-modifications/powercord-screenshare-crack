const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const { Plugin } = require('powercord/entities');
const Lodash = window._;

const Emoji = getModule(['isEmojiDisabled'], false);
const User = getModule(['getCurrentUser'], false);
const Guild = getModule(['getLastSelectedGuildId'], false);
const Emojis = getModule(['AUTOCOMPLETE_OPTIONS'], false);

module.exports = class ScreenshareCrack extends Plugin {
   startPlugin() {
      inject('screenshare-crack', User, 'getCurrentUser', (_, res) => {
         if (res) {
            const hasPremiumPerks = Boolean(res.hasPremiumPerks);
            const result = Lodash.cloneDeep(res);

            result.premiumType = 2;
            Object.defineProperty(result, 'hasPremiumPerks', {
               get: () => hasPremiumPerks
            });

            return result;
         }

         return res;
      });

      inject('is-emoji-disabled', Emoji, 'isEmojiDisabled', ([emoji, channel], res) => {
         const user = User.getCurrentUser();
         const guild = Guild.getGuildId();

         if (user?.originalPremiumType > 0) return res;

         if (!emoji.guildId || (guild == emoji.guildId && !emoji.animated) || user.hasPremiumPerks) {
            return false;
         }

         return true;
      });

      inject('is-emoji-filtered', Emojis.AUTOCOMPLETE_OPTIONS.EMOJIS_AND_STICKERS, 'queryResults', (args, res) => {
         const user = User.getCurrentUser();
         const guild = Guild.getGuildId();

         if (!user.hasPremiumPerks) {
            res.results.emojis = res.results.emojis.filter(emoji => {
               if (!emoji.guildId || (guild == emoji.guildId && !emoji.animated) || user.hasPremiumPerks) {
                  return true;
               }

               return false;
            });
         }

         return res;
      });
   };

   pluginWillUnload() {
      uninject('screenshare-crack');
      uninject('is-emoji-disabled');
      uninject('is-emoji-filtered');
   }
};