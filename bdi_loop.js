
/**
 * BDI
 */
const {LightOn} = require('./bdi/Goal')
const intentions =  require('./bdi/Intention')
const beliefs =  require('./bdi/beliefs')



// function recursive (v) {
//     console.log('fulfilled')
//     // TODO quit here if intention is no more valid
//     var yieldState = iterator.next(v)
//     var promise = yieldState.value
//     var finished = yieldState.done
//     if(!finished)
//         promise.then(recursive)
//     else
//         return true;
// }
// recursive(null)


// DON'T DO THIS: IT BLOCKS EVERYTHING!
// while (!state.done) {
//     // console.log(promise)
//     if(promise.isFulfilled)
//         iterator.next()
// }



// Keep track of intentions and desires tree
// 
// var intentionTree = [
//     
//     {
//         name: 'welcome_guests'
//     },
//     
//     {
//         name: 'swich_on_lights',
//         childs: [{
//             name: 'go_to_light_switcher',
//             childs: {}
//         }]
//     }
//     
// ]

var goalStack = []

// Reasoning cycle
async function reasoningCycle () {

    while (true) {
        
        // update beliefset through perceptions
        // fetch('localhost:1234/light')
        // .then( (light) => {
        //     if ( light.on )
        //         beliefs.lights.light1.on = true
        //     else
        //         beliefs.lights.light1.on = false
        // })
        
        // means-end reasoning
        // if (beliefs['asked_to_leave'])
        //     currentDesire = 'leave'
        
        // execution
        // for (let action of intentionTree) {
        //     if (action.contextCondition()) {
        //         action.exec()
        //     }
        // }

        for (let i = 0; i < goalStack.length; i++) {

            var goal = goalStack.shift()

        }
        
        // await Promise.resolve();
        await new Promise( res => setTimeout(res, 0))
    }
    
}

// For debugging only
// const log = console.log.bind(console)
// console.log = (...args) => {
//     // process.stdout.write(subGoal.constructor.name + ' {' + Object.entries(subGoal.parameters).map( kv => kv[0]+':'+kv[1] ).join(' ') + '} ');
//     process.stdout.write((new Error()).stack.split("\n")[2].trim().split(" ")[1] + '\t ')
//     log(...args)
// }

// postSubGoal(new LightOn({l: 'light0'}))
// postSubGoal(new LightOn({l: 'light1'}))

reasoningCycle()

