const {PickUp, PutDown, Stack, UnStack} = require('./blocksworldIntention')
const Intention = require('../bdi/Intention')
const Agent = require('../bdi/Agent')
const BlackboxGoal = require('../pddl/BlackboxGoal')
const BlackboxIntentionGenerator = require('../pddl/BlackboxIntentionGenerator')



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



var a1 = new Agent('a1')
a1.beliefs.declare('on-table a')
a1.beliefs.declare('on b a')
a1.beliefs.declare('clear b')
a1.beliefs.declare('empty')
a1.intentions.push(BlackboxIntentionGenerator([PickUp, PutDown, Stack, UnStack])) // always applicable
console.log('a1 entries', a1.beliefs.entries)
console.log('a1 literals', a1.beliefs.literals)
a1.postSubGoal( new BlackboxGoal( { goal: ['holding a'] } ) )



// var blackbox = new Blackbox(new LightOn({l: 'light1'}), './bin/blocks-domain.pddl', './bin/blocks-problem.pddl')
// var blackbox = new Blackbox(a1, new BlocksWorldGoal({ob: 'a'}))
// blackbox.run()
