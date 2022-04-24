const Beliefset =  require('./Beliefset')
const Intention = require('./Intention');



/**
 * @class Agent
 */
class Agent {

    constructor (name) {
        this.name = name

        /** @type {Beliefset} beliefs */
        this.beliefs = new Beliefset()

        this.beliefs.observeAny( (v,fact) => this.log( 'Beliefset: ' + (v?fact:'not '+fact) ) )

        /** @type {Array<Intention>} intentions */
        this.intentions = []
    }

    log (...args) {
        console.log( this.name + '\t\t', ...args )
    }

    async postSubGoal (subGoal) {
        
        // if (!this.beliefs.check(subGoal.precondition)) { //!subGoal.checkPrecondition()
        //     this.log('Goal cannot be taken, preconditions are not valid', subGoal)
        //     console.log(subGoal.precondition)
        //     console.log(this.beliefs)
        //     return
        // }
        
        for (let intentionClass of Object.values(this.intentions)) {
            
            if (!intentionClass.applicable(subGoal)) // By default applicable(goal) returns true (see class Intention)
                continue; // if not applicable try next
    
            this.log('Trying to use intention', intentionClass.name, 'to achieve goal', subGoal.toString())
    
            var intention = new intentionClass(this, subGoal)
            
            var success = await intention.run().catch( err => {this.log('Error in run() intention:', err)} )
    
            if ( success ) {
                this.log('Succesfully used intention', intentionClass.name, 'to achieve goal', subGoal.toString())
                return Promise.resolve(true) // same as: return true;
            }
            else {
                this.log('Failed to use intention', intentionClass.name, 'to achieve goal', subGoal.toString())
                continue // retrying
            }

        }
        
        this.log('No success in achieving goal', subGoal.toString())
        return Promise.resolve(false) // different from: return false; which would reject the promise!!!
        // throw new Error('No success in achieving goal'); // Promise rejection with explicit error. This should always be catched outside!
    
    }

}



// const {LightOn} = require('./bdi/Goal')
// const intentions =  require('./bdi/Intention')

// postSubGoal(new LightOn({l: 'light1'}))


// var kitchenAgent = new Agent('kitchen')
// kitchenAgent.intentions.push(...Object.values(intentions))
// kitchenAgent.postSubGoal(new LightOn({l: 'light0'}))

// environment.facts.push('in-room kitchen Marco')
// environment.facts.push('light-on light1')


module.exports = Agent