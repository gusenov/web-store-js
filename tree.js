/*jslint browser: true, devel: true, nomen: true, node:true */

(function () {
    "use strict";
    
    var WebStore, WebTreeStore;
    
    if (typeof window === 'undefined') {
        WebStore = require('./web-store');
    } else {
        WebStore = window.WebStore;
    }

    WebTreeStore = (function () {

        /**
         * Creates a new instance of class WebTreeStore.
         * @access public
         * @augments WebStore
         * @constructs WebTreeStore
         */
        function WebTreeStore(storageObject, storageId, dataChanged) {
            this.storage = storageObject;
            this.id = storageId;
            this._setItem(this.id + "-tree", true);
            this.dataChanged = dataChanged;
        }

        // Inheritance
        WebTreeStore.prototype = Object.create(WebStore.prototype);
        WebTreeStore.prototype.constructor = WebTreeStore;

        return WebTreeStore;
    }());
    
    if (typeof window === "undefined") {
        module.exports = WebTreeStore;
    } else {
        window.WebTreeStore = WebTreeStore;
    }
    
}());