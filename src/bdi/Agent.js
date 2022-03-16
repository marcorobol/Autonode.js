
/**
 * BDI
 */
const Beliefset =  require('./beliefset')


class Agent {

    constructor (name) {
        this.name = name
        this.beliefs = new Beliefset()
        // this.desires = []
        this.intentions = []
    }

    log (...args) {
        console.log( this.name + '\t\t', ...args )
    }

    async postSubGoal (subGoal) {
    
        if (!this.beliefs.check(subGoal.precondition)) { //!subGoal.checkPrecondition()
            this.log('Goal cannot be taken, preconditions are not valid', subGoal)
            console.log(subGoal.precondition)
            console.log(this.beliefs)
            return
        }
    
        // var intentionClass = Object.values(intentions).find( (i) => i.applicable(subGoal) )
        for (let intentionClass of Object.values(this.intentions)) {
    
            if (intentionClass.applicable && !intentionClass.applicable(subGoal))
                continue;
    
            this.log('Trying to use intention', intentionClass.name, 'to achieve goal', subGoal.toString())
    
            var intention = new intentionClass(this, subGoal)
            
            var success = await intention.run().catch( err => {this.log('Errors while run intention', err); return false;} )
    
            if ( success ) {
                this.log('Succesfully used intention', intentionClass.name, 'to achieve goal', subGoal.toString())
                return true
            }
            else {
                this.log('Failed to use intention', intentionClass.name, 'to achieve goal', subGoal.toString())
                continue // retrying
            }
            
    
        }
        
        this.log('No success in achieving goal', subGoal.toString())
        // return Promise.reject();
    
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