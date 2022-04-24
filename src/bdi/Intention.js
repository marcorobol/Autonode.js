const Goal = require('./Goal');
const Agent = require('./Agent');

var nextId = 0

/**
 * @class Intention
 */
class Intention {
    
    constructor (agent, goal) {
        this.id = nextId++
        
        /** @type {Agent} agent */
        this.agent = agent

        /** @type {Goal} goal */
        this.goal = goal
    }

    log (...args) {
        console.log( this.agent.name+'>'+this.constructor.name+'#'+this.id + '\t', ...args) //this.goal.constructor.name+'['+this.goal.id+']'+'>'
    }



    /**
     * 

     * @param {Goal} goal   goal, whatever it is
     * @returns {boolean}   true if applicable
     */
    static applicable (goal) {
        if (goal instanceof Goal)
            return true;
        else
            return false;
    }



    /**
     * If microtasks continuously add more elements to microTasks queue,
     * macroTasks will stall and won’t complete event loop in shorter time
     * causing event loop delays.
     * 
     * Check this:
     * - https://medium.com/dkatalis/eventloop-in-nodejs-macrotasks-and-microtasks-164417e619b9
     * Similarly it is for javascript on browser-side:
     * - https://medium.com/@idineshgarg/let-us-consider-an-example-a58bb1c11f55
     * 
     * await Promise.resolve(); // microtask, this would still block all timers and IO from being executed!!!
     * await new Promise( res => setTimeout(res, 0)) // macrotask, queues together with other timers and IO

     * @returns {Boolean}   true if success, otherwise false
     */
    async run () {

        var iterator = this.exec()
        var yieldValue = null
        var failed = false
        var done = false

        while (!failed && !done) {
            // TODO quit here if intention is no more valid
            // if (this.contextConditions && !this.contextConditions())
            //     return false;

            try {
                // execute next step and passing a value or waiting for the promise to resolve into a value
                var {value: yieldValue, done: done} = iterator.next(await yieldValue)

                // attach immediately a catch callback to avoid getting a
                // PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
                // https://javascript.tutorialink.com/why-do-i-get-an-unhandled-promise-rejection-with-await-promise-all/
                if (yieldValue instanceof Promise)
                    yieldValue.catch( err => {
                        console.error(err.stack || err);
                        failed = true;
                        return false;
                    } );

                // Always wait for a timer to avoid stopping the event loop within microtask queue!
                await new Promise( res => setTimeout(res, 0))

            // catch errors throwed by exec().next()
            } catch (err) {
                console.error(err.stack || err);
                failed = true;
                return false;
            }
        }

        if (done && !failed)
            return true;
        
        else {// failed 
            return false; // Since we are in an aync function, here we are rejecting the promise. We will need to catch this!
        }

    }

}



module.exports = Intention