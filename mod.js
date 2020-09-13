/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import {
  _,
  Swarm,
} from "./deps.js";


var Bzz = function Bzz(provider) {

    this.givenProvider = Bzz.givenProvider;

    if (provider && provider._requestManager) {
        provider = provider.currentProvider;
    }

    this.setProvider(provider);
};

// set default ethereum provider
/* jshint ignore:start */
Bzz.givenProvider = null;
if (typeof ethereum !== 'undefined' && ethereum.bzz) {
    Bzz.givenProvider = ethereum.bzz;
}
/* jshint ignore:end */

Bzz.prototype.setProvider = function(provider) {
    // is ethereum provider
    if(_.isObject(provider) && _.isString(provider.bzz)) {
        provider = provider.bzz;
    }


    if(_.isString(provider)) {
        this.currentProvider = provider;
    } else {
        this.currentProvider = null;

        var noProviderError = new Error('No provider set, please set one using bzz.setProvider().');

        this.download = this.upload = this.isAvailable = function(){
            throw noProviderError;
        };

        return false;
    }

    const swarm = new Swarm(provider);

    this.download = swarm.download.bind(swarm);
    this.upload = (file) => {
      if(file instanceof Uint8Array){
        return swarm.upload(file);
      }else if (typeof file === "string"){
        return swarm.upload(fileTextEncoder().encode(file));
      }else{
        throw new Error(`Type of file: ${typeof file} not supported`)
      }
    };
    this.isAvailable = swarm.isAvailable.bind(swarm);

    return true;
};


export default Bzz;

