const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const pddlActionIntention = require('../pddl/actions/pddlActionIntention')



class FakeAction extends pddlActionIntention {

    async checkPreconditionAndApplyEffect () {
        if ( this.checkPrecondition() ) {
            this.applyEffect()
            await new Promise(res=>setTimeout(res,1000))
            // this.log('effects applied')
        }
        else
            throw new Error('pddl precondition not valid'); //Promise is rejected!
    }

}

class PickUp extends FakeAction {
    static parameters = ['ob']
    static precondition = [ ['clear', 'ob'], ['on-table', 'ob'], ['empty'] ]
    static effect = [ ['holding', 'ob'], ['not empty'], ['not clear', 'ob'], ['not on-table', 'ob'] ]
}

class PutDown extends FakeAction {
    static parameters = ['ob']
    static precondition = [ ['holding', 'ob'] ]
    static effect = [ ['not holding', 'ob'], ['empty'], ['clear', 'ob'], ['on-table', 'ob'] ]
}

class Stack extends FakeAction {
    static parameters = ['x', 'y']
    static precondition = [ ['holding', 'x'], ['clear', 'y'] ]
    static effect = [ ['holding', 'x'], ['empty'], ['clear', 'x'], ['not clear', 'y'], ['on', 'x', 'y'] ]
}

class UnStack extends FakeAction {
    static parameters = ['x', 'y']
    static precondition = [ ['on', 'x', 'y'], ['clear', 'x'], ['empty'] ]
    static effect = [ ['holding', 'x'], ['not empty'], ['not clear', 'x'], ['clear', 'y'], ['not on', 'x', 'y'] ]
}



const world = new Agent('world');

world.pickUp = function ({ob} = args) {
    return new PickUp(world, new Goal({ob}) ).checkPreconditionAndApplyEffect()
    .catch(err=>{throw new Error('world.pickUp failed')})
}

world.putDown = function ({ob} = args) {
    return new PutDown(world, new Goal({ob}) ).checkPreconditionAndApplyEffect()
    .catch(err=>{throw new Error('world.putDown failed')})
}

world.stack = function ({x, y} = args) {
    return new Stack(world, new Goal({x, y}) ).checkPreconditionAndApplyEffect()
    .catch(err=>{throw new Error('world.stack failed')})
}

world.unStack = function ({x, y} = args) {
    return new UnStack(world, new Goal({x, y}) ).checkPreconditionAndApplyEffect()
    .catch(err=>{throw new Error('world.unStack failed')})
}



module.exports = world
