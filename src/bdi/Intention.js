
var nextId = 0

class Intention {
    
    postSubGoal (subgoal) {
        return this.agent.postSubGoal(subgoal);
    }

    constructor (agent, goal) {
        this.id = nextId++
        this.agent = agent
        this.goal = goal
    }

    log (...args) {
        console.log( this.agent.name+'>'+this.constructor.name+'#'+this.id + '\t', ...args) //this.goal.constructor.name+'['+this.goal.id+']'+'>'
    }

    async run () {

        var iterator = this.exec()
        var value = null
        var failed = false
        var done = false

        while (!failed && !done) {
            // TODO quit here if intention is no more valid
            // break
            // if (this.contextConditions && !this.contextConditions())
            //     return false;

            var {value: promise, done: done} = iterator.next(value)

            if (promise == undefined) {
                value = null;
                await Promise.resolve();
            }
            else
                value = await promise.catch( err => {console.log('Error in intention execution:', err); failed = true} );
        }

        if (done && !failed)
            return true;
        
        else {// failed 
            return false
        }

    }

}



module.exports = Intention