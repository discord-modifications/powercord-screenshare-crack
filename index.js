const { getModule } = require('powercord/webpack');
const { Plugin } = require('powercord/entities');

const Lodash = window._;
const Stream = getModule(['ApplicationStreamFPSButtons'], false);

module.exports = class ScreenshareCrack extends Plugin {
   startPlugin() {
      const requirements = Stream.ApplicationStreamSettingRequirements;
      this.original = Lodash.cloneDeep(requirements);

      for (let i = 0; i < requirements.length; i++) {
         for (const key in requirements[i]) {
            if (!~['resolution', 'fps'].indexOf(key)) {
               delete requirements[i][key];
            }
         }
      }
   };

   pluginWillUnload() {
      Stream.ApplicationStreamSettingRequirements = this.original;
   }
};
