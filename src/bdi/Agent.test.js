const Agent = require('./Agent')
const {LightOn, DimOffLight, DimOnLight} = require('../lightsworld')


test('Agent', () => {

  expect(new Agent('a1').name).toBe('a1');

});

test('Agent.postSubGoal => Succesfully used intention', async () => {
  
  // jest.setTimeout(10000)

  var agent = new Agent('a1')
  agent.beliefs.apply('switched-off light0')
  agent.intentions.push(DimOnLight)

  expect(await agent.postSubGoal(new LightOn({l: 'light0'}))).toBe(true);

});

test('Agent.postSubGoal => Goal cannot be taken, preconditions are not valid', async () => {
  
  // jest.setTimeout(10000)

  var agent = new Agent('kitchen')
  agent.beliefs.apply('not switched-off light0')
  agent.intentions.push(DimOnLight)

  expect(await agent.postSubGoal(new LightOn({l: 'light0'}))).toBe(undefined);

});

test('Agent.postSubGoal => No success in achieving goal', async () => {
  
  // jest.setTimeout(10000)

  var agent = new Agent('kitchen')
  agent.beliefs.apply('switched-off light0')

  expect(await agent.postSubGoal(new LightOn({l: 'light0'}))).toBe(undefined);

});
