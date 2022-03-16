const blackboxGenerator = require('./Blackbox')
const Agent = require('../bdi/Agent')
const {LightOn, DimOffLight, DimOnLight} = require('../lightsworld')



test('Blackbox.blackboxExec', async () => {

    var Blackbox = blackboxGenerator([LightOn])
    var blackbox = new Blackbox(new Agent('a1'), new LightOn({l: 'light1'}))
    await blackbox.blackboxExec('./src/pddl/domain-lights.test.pddl', './src/pddl/problem-lights.test.pddl')
    expect(blackbox.plan.length).toBe(1);

    blackbox.agent.intentions.push(DimOnLight)
    blackbox.run()

});