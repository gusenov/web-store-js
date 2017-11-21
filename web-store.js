/*jslint
    nomen: true,
    node: true
*/
/*eslint
    no-console: "off"
*/
/*eslint-env
    browser,
    node
*/

(function () {
    "use strict";
    
    var WebStore = (function () {

        /**
         * The data in the [storage]{@link WebStore#storage} is changed whenever a record is added, edited, or removed. 
         * The [dataChanged]{@link WebStore#dataChanged} method might be used any time this happens to refresh any component that is using the data.
         * @access public
         * @callback WebStore~dataChangedCallback
         */

        /**
         * Creates a new instance of class WebStore.
         * @access public
         * @constructs WebStore
         * @param {Storage} storageObject - Either sessionStorage or localStorage objects.
         * @param {string} storageId - The unique ID used as the key in which all record data are stored in the storageObject.
         * @param {WebStore~dataChangedCallback=} dataChanged - The callback that handles the data in storage changed.
         */
        function WebStore(storageObject, storageId, dataChanged) {
            // pre-condition
            console.assert(storageObject instanceof Storage, 'storageObject should be Storage');
            console.assert(typeof storageId === 'string', 'storageId should be string');
            if (dataChanged) {
                console.assert(typeof dataChanged === 'function', 'dataChanged should be function');
            }

            /** 
             * Provides access to a list of key/value pairs, which are sometimes called items. 
             * Keys are strings. Any string (including the empty string) is a valid key. 
             * Values are similarly strings.
             * @access private
             * @member {Storage} 
             */
            this.storage = storageObject;

            /** 
             * The unique ID used as the key in which all record data are stored in the [storage]{@link WebStore#storage}.
             * @access private
             * @member {string} 
             */
            this.id = storageId;

            /** 
             * The callback that handles the data in [storage]{@link WebStore#storage} changed.
             * @access public
             * @member {WebStore~dataChangedCallback} 
             */
            this.dataChanged = dataChanged;
        }

        /**
         * When passed a key name and value, will add that key to the [storage]{@link WebStore#storage}, or update that key's value if it already exists.
         * @access protected
         * @memberof WebStore
         * @method
         * @param {string} key - A string containing the name of the key you want to create/update.
         * @param {*} value - The value you want to give the key you are creating/updating.
         * @returns No return value.
         */
        WebStore.prototype._setItem = function (key, value) {
            // pre-condition
            console.assert(typeof key === 'string', 'key should be string');

            this.storage.setItem(key, JSON.stringify(value));
        };

        /**
         * When passed a key name, will return that key's value.
         * @access protected
         * @memberof WebStore
         * @method
         * @param {string} key - A string containing the name of the key you want to retrieve the value of.
         * @returns {*} The value of the key. If the key does not exist, null is returned.
         */
        WebStore.prototype._getItem = function (key) {
            // pre-condition
            console.assert(typeof key === 'string', 'key should be string');

            var value = this.storage.getItem(key);
            return value ? JSON.parse(value) : null;
        };

        /**
         * When passed a key name, will remove that key from the storage.
         * @access protected
         * @memberof WebStore
         * @method
         * @param {string} key - A string containing the name of the key you want to remove.
         * @returns No return value.
         */
        WebStore.prototype._removeItem = function (key) {
            // pre-condition
            console.assert(typeof key === 'string', 'key should be string');

            this.storage.removeItem(key);
        };

        /**
         * Name of counter to get.
         * @access protected
         * @memberof WebStore
         * @method
         */
        WebStore.prototype._getRecordCounterKey = function () {
            return this.id + "-counter";
        };

        /**
         * Returns the value of a counter.
         * @access protected
         * @memberof WebStore
         * @method
         * @returns {number} Value of counter.
         */
        WebStore.prototype._getRecordCounterValue = function () {
            var counter = this._getItem(this._getRecordCounterKey());
            if (counter) {
                return parseInt(counter, 10);
            } else {
                return 0;
            }
        };

        /**
         * Increments the value of the counter. The increment value is 1.
         * @access protected
         * @memberof WebStore
         * @method
         * @returns {number} Incremented value of counter.
         */
        WebStore.prototype._incRecordCounterValue = function () {
            var newCounterValue = this._getRecordCounterValue() + 1;
            this._setItem(this._getRecordCounterKey(), newCounterValue);
            return newCounterValue;
        };


        /**
         * @access protected
         * @memberof WebStore
         * @method
         */
        WebStore.prototype._getSizeKey = function () {
            return this.id + "-size";
        };

        /**
         * Returns the total size of records managed by this instance of WebStore.
         * @access public
         * @memberof WebStore
         * @method
         * @returns {number} Array of record IDs.
         */
        WebStore.prototype.getSize = function () {
            var size = this._getItem(this._getSizeKey());
            if (size) {
                return parseInt(size, 10);
            } else {
                return 0;
            }
        };

        /**
         * Increments the value of the size. The increment value is 1.
         * @access protected
         * @memberof WebStore
         * @method
         * @returns {number} Incremented value of size.
         */
        WebStore.prototype._incSize = function () {
            var newSizeValue = this.getSize() + 1;
            this._setItem(this._getSizeKey(), newSizeValue);
            return newSizeValue;
        };

        /**
         * Decrements the value of the size. The decrement value is 1.
         * @access protected
         * @memberof WebStore
         * @method
         * @returns {number} Decremented value of size.
         */
        WebStore.prototype._decSize = function () {
            var newSizeValue = this.getSize() - 1;
            this._setItem(this._getSizeKey(), newSizeValue);
            return newSizeValue;
        };

        /**
         * Returns the entire array of record IDs managed by this instance of WebStore.
         * @access public
         * @memberof WebStore
         * @method
         * @returns {string[]} Array of record IDs.
         */
        WebStore.prototype.getAllRecordIds = function () {
            var allRecordIds = this._getItem(this.id);
            return allRecordIds || [];
        };

        /**
         * Add a record id to the array of record IDs managed by this instance of WebStore.
         * @access protected
         * @memberof WebStore
         * @method
         * @returns No return value.
         */
        WebStore.prototype._addRecordId = function (recordId) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            var allRecordIds = this.getAllRecordIds();
            allRecordIds.push(recordId);
            this._setItem(this.id, allRecordIds);
        };

        /**
         * Remove a record id from the array of record IDs managed by this instance of WebStore.
         * @access protected
         * @memberof WebStore
         * @method
         * @param {string} recordId - The ID of the record to remove.
         * @returns No return value.
         */
        WebStore.prototype._removeRecordId = function (recordId) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            var allRecordIds = this.getAllRecordIds(),
                recordIndex = allRecordIds.indexOf(recordId);
            if (recordIndex > -1) {
                allRecordIds.splice(recordIndex, 1);
                this._setItem(this.id, allRecordIds);
            }
        };

        /**
         * The getRecordKeyById method returns a unique record key, which identifier is passed by the recordId input parameter.
         * @access protected
         * @memberof WebStore
         * @method
         * @param {string} recordId - A record identifier.
         */
        WebStore.prototype._getRecordKeyById = function (recordId) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            return this.id + "-" + recordId;
        };

        /**
         * Create a record in the [storage]{@link WebStore#storage}.
         * @access public
         * @memberof WebStore
         * @method
         * @param {Object} record - The content of the created record.
         * @returns {Object} The created record with "id" field initialized.
         */
        WebStore.prototype.createRecord = function (record) {
            // pre-condition
            console.assert(typeof record === 'object', 'record should be object');

            var newRecord = JSON.parse(JSON.stringify(record));
            newRecord.id = this._incRecordCounterValue().toString();
            this._setItem(this._getRecordKeyById(newRecord.id), newRecord);
            this._addRecordId(newRecord.id);
            this._incSize();
            if (this.dataChanged) { this.dataChanged(); }
            return newRecord;
        };

        /**
         * Update the record data.
         * To update an existing record, make sure you set the "id" field in the record object.
         * @access public
         * @memberof WebStore
         * @method
         * @param {Object} record - Specifies the new content for the record.
         * @returns No return value.
         */
        WebStore.prototype.updateRecord = function (record) {
            this._setItem(this._getRecordKeyById(record.id), record);
            if (this.dataChanged) { this.dataChanged(); }
        };

        /**
         * Retrieves a record object from a [storage]{@link WebStore#storage}.
         * @access public
         * @memberof WebStore
         * @method
         * @param {string} recordId - The ID of the record to retrieve from the [storage]{@link WebStore#storage}.
         * @returns {Object|boolean} The record with the passed ID. Returns false if not found.
         */
        WebStore.prototype.getRecordById = function (recordId) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            var record = this._getItem(this._getRecordKeyById(recordId));
            return record || false;
        };

        /**
         * Gets the record by the record index.
         * @access public
         * @memberof WebStore
         * @method
         * @param {number} recordIndex - A value that specifies the index position of the record in the [storage]{@link WebStore#storage}.
         * @returns {Object|boolean} A record object that has the specified index value. Returns false if not found.
         */
        WebStore.prototype.getRecordByIndex = function (recordIndex) {
            // pre-condition
            console.assert(typeof recordIndex === 'number', 'recordIndex should be number');

            var allRecordIds = this.getAllRecordIds(),
                recordId = allRecordIds[recordIndex],
                record = this._getItem(this._getRecordKeyById(recordId));
            return record || false;
        };

        /**
         * Function to execute for each record. 
         * @access public
         * @callback WebStore~forEachRecordCallback
         * @param {Object} record - The current record being processed in the [storage]{@link WebStore#storage}.
         * @param {number} recordIndex - The index of the current record being processed in the [storage]{@link WebStore#storage}.
         * @returns {boolean} Use "return false" to stop the iteration.
         */

        /**
         * The forEachRecord() method calls a provided function once for each record, in order.
         * @access public
         * @memberof WebStore
         * @method     
         * @param {WebStore~forEachRecordCallback} callback - A function to be run for each record.
         * @param {number} [startIndex=0] - The index to start iterating at.
         * @returns No return value.
         */
        WebStore.prototype.forEachRecord = function (callback, startIndex) {
            console.assert(typeof callback === 'function', 'callback should be function');

            var allRecordIds = this.getAllRecordIds(),
                recordIndex,
                record;

            startIndex = typeof startIndex !== 'undefined' ? startIndex : 0;

            for (recordIndex = startIndex; recordIndex < allRecordIds.length; recordIndex += 1) {
                record = this.getRecordById(allRecordIds[recordIndex]);
                if (callback.bind(this)(record, recordIndex)) {
                    break;
                }
            }
        };

        /**
         * Gets all records associated with this instance of WebStore.
         * @access public
         * @memberof WebStore
         * @method
         * @returns {Object[]} The array of record objects.
         */
        WebStore.prototype.getAllRecords = function () {
            var allRecords = [];
            this.forEachRecord(function (record) {
                allRecords.push(record);
            });
            return allRecords;
        };

        /**
         * Finds the index of the first matching record in this store by a specific field value.
         * @access public
         * @memberof WebStore
         * @method
         * @param {string} property - The name of the record field to test.
         * @param {string|RegExp} value - Either a string that the field value should begin with, or a RegExp to test against the field.
         * @param {number} [startIndex=0] - The index to start searching at.
         * @returns {number} The matched index or -1.
         */
        WebStore.prototype.find = function (property, value, startIndex) {
            var foundRecordIndex = -1,
                propertyValue;
            this.forEachRecord(function (record, recordIndex) {
                if (record.hasOwnProperty(property)) {
                    propertyValue = record[property];
                    if (typeof propertyValue === 'string') {
                        if (typeof value === 'string') {
                            if (propertyValue.match(value)) {
                                foundRecordIndex = recordIndex;
                                return true;
                            }
                        }
                    } else if (typeof propertyValue === 'number') {
                        if (typeof value === 'number') {
                            if (propertyValue === value) {
                                foundRecordIndex = recordIndex;
                                return true;
                            }
                        }
                    }
                }
            }, startIndex);
            return foundRecordIndex;
        };

        /**
         * Function to execute on each record in this store.
         * @access public
         * @callback WebStore~findByCallback
         * @param {Object} record - The record to test for filtering.
         * @param {number} recordIndex - The index of the record passed.
         * @returns {boolean} Returns false if not found.
         */

        /**
         * Find the index of the first matching record in this store by a function. 
         * If the function returns true it is considered a match.
         * @access public
         * @memberof WebStore
         * @method
         * @param {WebStore~findByCallback} fn - The function to be called.
         * @param {number} [startIndex=0] - The index to start searching at.
         * @returns {number} The matched index or -1.
         */
        WebStore.prototype.findBy = function (fn, startIndex) {
            console.assert(typeof fn === 'function', 'fn should be function');

            var foundRecordIndex = -1;
            this.forEachRecord(function (record, recordIndex) {
                if (fn(record, recordIndex)) {
                    foundRecordIndex = recordIndex;
                    return true;
                }
            }, startIndex);
            return foundRecordIndex;
        };

        /**
         * The deleteRecordById method deletes a record that is stored within a [storage]{@link WebStore#storage}.
         * @access public
         * @memberof WebStore
         * @method
         * @param {string} recordId - A string that specifies the ID. The argument should be the value of the "id" property of the record definition that you want to delete.
         * @returns No return value.
         */
        WebStore.prototype.deleteRecordById = function (recordId) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            this._removeItem(this._getRecordKeyById(recordId));
            this._removeRecordId(recordId);
            this._decSize();
            if (this.dataChanged) { this.dataChanged(); }
        };
        
        /**
         * The deleteRecordByIndex method deletes a record by the record index.
         * @access public
         * @memberof WebStore
         * @method
         * @param {number} recordIndex - A value that specifies the index position of the record in the [storage]{@link WebStore#storage}.
         * @returns No return value.
         */
        WebStore.prototype.deleteRecordByIndex = function (recordIndex) {
            // pre-condition
            console.assert(typeof recordIndex === 'number', 'recordIndex should be number');

            var record = this.getRecordByIndex(recordIndex),
                recordId = record.id;
            this.deleteRecordById(recordId);
        };

        /**
         * @typedef DhtmlxGridJsonDataStructure     
         * @type Object
         * @property {DhtmlxGridRowJsonDataStructure[]} rows - Array which contains an object for each of the record rows.
         * @property {number} total_count - This is optional, but when using large data sets with any type of paging, DHTMLX utilizes this property. Additionally, this can be used to display the number of records in a status bar at the bottom of a grid.
         */

        /**
         * The getDhtmlxGrid method will return the formatted object to be loaded into the DHTMLX grid.
         * @access public
         * @memberof WebStore
         * @method
         * @returns {DhtmlxGridJsonDataStructure} An object containing the values for the dhtmlxGrid.
         */
        WebStore.prototype.getDhtmlxGrid = function (columnKeys) {
            var row, rows = [];
            this.forEachRecord(function (record) {
                row = this.getDhtmlxGridRowByRecordId(record.id, columnKeys);
                rows.push(row);
            });
            return {
                "rows" : rows,
                "total_count" : rows.length
            };
        };

        /**
         * @typedef DhtmlxGridRowJsonDataStructure
         * @type Object
         * @property {string} id - The ID needs to be unique or the grid will not operate correctly.
         * @property {Array} data - This is an array of data for each column. The placement in the array corresponds to the column it will show in.
         */

        /**
         * The getDhtmlxGridRowByRecordId method is exactly that. 
         * This will structure a record object into a formatted row item for use in the grid data.
         * @access public
         * @memberof WebStore
         * @method
         * @returns {DhtmlxGridRowJsonDataStructure} An object for record row.
         */
        WebStore.prototype.getDhtmlxGridRowByRecordId = function (recordId, columnKeys) {
            // pre-condition
            console.assert(typeof recordId === 'string', 'recordId should be string');

            var record = this.getRecordById(recordId), data = [];
            if (typeof columnKeys === "undefined") {
                columnKeys = Object.keys(record);
            }
            columnKeys.forEach(function (key) {
                if (record.hasOwnProperty(key)) {
                    data.push(record[key]);
                }
            });
            return {
                "id" : record.id,
                "data" : data
            };
        };

        return WebStore;
    }());
    
    if (typeof window === "undefined") {
        module.exports = WebStore;
    } else {
        window.WebStore = WebStore;
    }

}());