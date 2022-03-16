
class Environment extends BeliefSet{
    
    

}



class House extends Environment {

    /**
     * APIs
     */
    switchOnLight (l) {
        //fetch.post(turn on light1)
        //await result and then
        this.declare('switched-on '+l)
        this.undeclare('switched-off '+l)
    }

}



var house = new House()
var obs1 = function (fact, value) {console.log(fact,value)}
house.observe(obs1, 'switched-on light1')
house.declare('switched-on light1')
console.log(house.facts)
house.unobserve(obs1, 'switched-on light1')
house.declare('switched-on light1')

house.facts