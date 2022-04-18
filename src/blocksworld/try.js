const {PickUp, PutDown, Stack, UnStack} = require('.')
const Intention = require('../bdi/Intention')
const Agent = require('../bdi/Agent')
const {PddlProblem, PddlDomain, blackboxGenerator} = require('../pddl')


// var blocksworldDomain = new PddlDomain('blocksworld')
// blocksworldDomain.addPredicate(['clear', 'x'])
// blocksworldDomain.addPredicate(['on-table', 'x'])
// blocksworldDomain.addPredicate(['holding', 'x'])
// blocksworldDomain.addPredicate(['on', 'x' ,'y'])
// blocksworldDomain.addPredicate(['empty'])
// blocksworldDomain.addAction(PickUp)
// blocksworldDomain.addAction(PutDown)
// blocksworldDomain.addAction(Stack)
// blocksworldDomain.addAction(UnStack)
// blocksworldDomain.saveToFile()



// var blocksworldProblem = new PddlProblem('blocksworld')
// blocksworldProblem.addObject('a', 'b')
// blocksworldProblem.addInit('on-table a', 'on-table b', 'clear a', 'clear b', 'empty')
// blocksworldProblem.addGoal('holding a')
// blocksworldProblem.saveToFile()





class FakeAction extends Intention {

    static applicable (goal) {
        return goal instanceof PickUp || goal instanceof PutDown || goal instanceof Stack || goal instanceof UnStack
    }

    *exec () {
        for ( let b of this.goal.effect )
            this.agent.beliefs.apply(b)
        yield new Promise(res=>setTimeout(res,100))
        this.log('effects applied')
        // this.log(this.agent.beliefs)
    }

}

var a1 = new Agent('a1')
a1.beliefs.declare(...['on-table a', 'on b a', 'clear b', 'empty'])
// a1.desires.push(PickUp)
// a1.desires.push(PutDown)
// a1.desires.push(Stack)
// a1.desires.push(UnStack)
a1.intentions.push(FakeAction)
a1.intentions.push(blackboxGenerator([PickUp, PutDown, Stack, UnStack])) // always applicable


// class BlocksWorldGoal extends Goal {
//     static parameters = ['ob']
//     static precondition = []
//     static effect = [ ['holding', 'ob'] ]
// }

a1.postSubGoal( ['holding a'] )

// var blackbox = new Blackbox(new LightOn({l: 'light1'}), './bin/blocks-domain.pddl', './bin/blocks-problem.pddl')
// var blackbox = new Blackbox(a1, new BlocksWorldGoal({ob: 'a'}))
// blackbox.run()
