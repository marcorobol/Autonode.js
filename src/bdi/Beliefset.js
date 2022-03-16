
class Beliefset {
    
    constructor () {
        this.factsMap = {} // observable facts
        this.objectsMap = {}
    }

    addObject (obj) {
        if (!(typeof obj === 'string'))
            throw('String expected, got ' + typeof obj + ': ' + obj)
        this.objectsMap[obj] = obj
    }

    removeObject (obj) {
        if (!(typeof obj === 'string'))
            throw('String expected, got ' + typeof obj + ': ' + obj)
        delete this.objectsMap[obj];
    }

    undeclare (fact) {
        return this.declare(fact,false)
    }

    declare (fact, value=true) {
        // if (Array.isArray(fact))
        //     throw(fact + 'is not a valid fact to be declared')
        if (!(typeof fact === 'string'))
            throw('String expected, got ' + typeof fact + ': ' + fact)
        if (fact.split(' ')[0] == 'not')
            throw('Fact expected, got a negative literal: ' + fact)
        
        if (!(fact in this.factsMap) || this.factsMap[fact].value != value)
            for (let obj of fact.split(' ').splice(1))
                this.addObject(obj)

        if (!(fact in this.factsMap))
            this.factsMap[fact] = {value: value, observers: []};
        else if (this.factsMap[fact].value != value)
            this.factsMap[fact].value = value;
        else
            return false; // unchanged

        for (let o of this.factsMap[fact].observers )
            o(fact, value);
        return true; // changed and observers notified
    }

    observe (observer, fact) {
        if (!(fact in this.factsMap))
            this.factsMap[fact] = {value: undefined, observers: []}
        this.factsMap[fact].observers.push(observer)
    }

    unobserve (observer, fact) {
        if ((fact in this.factsMap)) {
            let arr = this.factsMap[fact].observers
            for( var i = 0; i < arr.length; i++){ 
                if ( arr[i] === observer) { 
                    arr.splice(i, 1); 
                    i--; 
                }
            }
        }
    }

    apply (literal) {
        var not = literal.split(' ')[0] == 'not'
        var fact = (not?literal.split(' ').splice(1).join(' '):literal)
        this.declare(fact, !not)
    }

    get facts () {
        return this.factsMap;
    }

    get literals () {
        var literals = {}
        for ( let entry of Object.entries(this.factsMap) ) {
            let key = entry[0]
            let {value,observers} = entry[1]
            literals[key] = value
        }
        return literals;
    }

    get objects () {
        return Object.values(this.objectsMap);
    }

    check (literalConjunction) {
        for ( let literal of literalConjunction ) {
            var not = literal.split(' ')[0] == 'not'
            var fact = (not?literal.split(' ').splice(1).join(' '):literal)
            
            if ( this.factsMap[fact] && this.factsMap[fact].value==true )
                if ( not )
                    return false;
                else
                    continue;
            else // Closed World assumption; if i don't know about something then it is false
                if ( not )
                    continue;
                else
                    return false;
        }

        return true;
    }

    static ground (parametrizedConjunction, parametersMap) {
        return parametrizedConjunction.map( (parametrized) => {
            let predicate = parametrized[0]
            let vars = parametrized.slice(1)
            let literal = predicate
            for (let v of vars)
                literal = literal + ' ' + parametersMap[v]
            return literal
        })
    }

}



module.exports = Beliefset