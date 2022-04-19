

/**
 * Observer callback function
 * @callback observer
 * @param {*} key
 * @param {*} value
 */



/**
 * Observable
 * @class Observable
 * @constructor
 */
class Observable {
    #map;

    /**
     * @constructor Observable
     * @param {*} init 
     */
    constructor (init) {
        this.#map = {}
        for (let [key,value] of Object.entries(init)) {
            this.defineProperty (key, value);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value optional
     */
    defineProperty (key, value = undefined) {
        if (!(key in this.#map)) {
            this.#map[key] = { value: value, observers: {} }
            this[key] = {}
            Object.defineProperty (this, key, {
                get: () => this.#map[key].value,
                set: (v) => {
                    this.#map[key].value = v;
                    Promise.resolve().then( () => {
                        for (let o in this.#map[key].observers)
                            this.#map[key].observers[o](v, key);
                    }).catch( err => console.error(err) )
                }
            })
            return true;
        }
        return false;
    }
    
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @returns true if changed, false otherwise
     */
    set (key, value = undefined) {
        if ( this.defineProperty(key, value) )
            return true
        else if ( this[key] != value ) {
            this[key] = value;
            return true
        }
        else
            return false
    }

    /**
     * @return {Array}    Return an array of [key, value] to iterate over
     */
    get entries () {
        return Object.entries(this.#map).map( ([key, {value, observers}]) => [key, value] );
    }

    /**
     * 
     * @param {*} key 
     * @param {observer} observer function(key, value)
     */
    observe (key, observer) {
        if (!(key in this.#map)) {
            this.defineProperty (key)
        }
            this.#map[key].observers[observer] = observer
    }

    /**
     * 
     * @param {*} key 
     * @param {observer} observer function(key, value)
     */
    unobserve (key, observer) {
        if (key in this.#map)
            delete this.#map[key].observers[observer]
    }

    /**
     * 
     * @param {*} key
     * @returns {Promise} Promise that resolves when observed value changes
     */
    async notifyChange (key) {
        return new Promise( res => {
            var tmpObs = (value, key) => {
                res(value)
                this.unobserve(key, tmpObs)
            }
            this.observe(key, tmpObs)
        })
    }

}



module.exports = Observable