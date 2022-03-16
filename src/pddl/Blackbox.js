const Intention = require('../bdi/Intention')
const PddlDomain = require('./PddlDomain')
const PddlProblem = require('./PddlProblem')
const execFile = require('child_process').execFile;



function blackboxGenerator (desires = []) {

    var Blackbox = class extends Intention {
        
        constructor (agent, goal) {
            super(agent, goal)
            this.plan = []; // [{parallel: true, goal: goalInstance}]
        }

        static actions = {}

        static addAction (desireClass) {
            this.actions[desireClass.name.toLowerCase()] = desireClass
        }

        static getAction (name) {
            return this.actions[name]
        }

        static applicable (goal) {
            for ( let entry of Object.entries(this.actions) ) {
                desireName = entry[0]
                desireClass = entry[1]
                if ( goal == desireClass )
                    return false
            }
            return true
        }

        async blackboxExec (domainFile, problemFile) {

            var result = '';
            
            var child = execFile('./bin/blackbox.exe', ['-o', domainFile, '-f', problemFile]);

            child.stdout.on('data', function(data) {
                result += data;
            });

            await new Promise( res => child.on('close', res) );

            // console.log(result);
            
            this.log('Plan found:')
            var planStruct = []
            var planBeginned = false
            for (let line of result.split('\n')) {
                // this.log(line)
                if (line=='Begin plan')
                    planBeginned = true
                else if (line=='End plan')
                    break;
                else if (planBeginned) {
                    this.log(line)
                    planStruct.push(line.replace('(','').replace(')','').split(' '));
                }
            }

            if (!planBeginned) {
                this.log('no plan found')
                this.log(result)
                return Promise.reject('Plan not found');
            }

            var previousNumber = 0
            for (let line of planStruct) {
                var number = line.shift()
                var action = line.shift()
                var args = line
                // console.log(number, action, args)
                var intentionClass = this.constructor.getAction(action)
                var goalInstance = new intentionClass(args)
                this.plan.push({parallel: number==previousNumber, goal: goalInstance});
            }
            
            return;
        }

        *exec () {
            
            var pddlDomain = new PddlDomain(this.agent.name)
            pddlDomain.addAction(...Object.values(this.constructor.actions))
            var domainFile = yield pddlDomain.saveToFile()

            var pddlProblem = new PddlProblem(this.agent.name)
            pddlProblem.addObject(...this.agent.beliefs.objects) //'a', 'b'
            pddlProblem.addInit(...this.agent.beliefs.literals)
            pddlProblem.addGoal(...this.goal.effect)
            var problemFile = yield pddlProblem.saveToFile()

            yield this.blackboxExec(domainFile, problemFile)

            var previousStepGoals = []

            for (const step of this.plan) {
                if(step.parallel) {
                    previousStepGoals.push( this.agent.postSubGoal(step.goal) )
                }
                else {
                    yield Promise.all(previousStepGoals)
                    previousStepGoals = [ this.agent.postSubGoal(step.goal) ]
                }
            }

            // wait for last steps to complete before finish blackbox plan execution intention
            yield Promise.all(previousStepGoals)

        }

    }

    for ( let desireClass of desires ) {
        Blackbox.addAction(desireClass)
    }

    return Blackbox;
}



// var kitchenAgent = new Agent('kitchen')
// kitchenAgent.intentions.push(DimOnLight)
// kitchenAgent.intentions.push(Blackbox)

// var blackbox = new Blackbox(kitchenAgent, new LightOn({l: 'light1'}), './tmp/domain-lights.pddl', './tmp/problem-lights.pddl')
// blackbox.run()



module.exports = blackboxGenerator