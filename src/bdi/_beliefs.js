
var beliefs = [] // 'switched-off light0', 'switched-off light1', 'position bob kitchen'

beliefs.check = function (groundedConjunction) {
    for ( let ground of groundedConjunction ) {
        if ( ground.split(' ')[0] == 'not' )
            if ( beliefs.find( (b) => { return b == ground.split(' ').splice(1).join(' ') } ) )
                return false;
            else
                continue;
        else
            if ( beliefs.find( (b) => { return b == ground } ) )
                continue;
            else
                return false;
    }
    return true;
}

beliefs.ground = function (parametrizedConjunction, parametersMap) {
    return parametrizedConjunction.map( (parametrized) => {
        let predicate = parametrized[0]
        let vars = parametrized.slice(1)
        let ground = predicate
        for (let v of vars)
            ground = ground + ' ' + parametersMap[v]
        return ground
    })
}

beliefs.apply = function (ground) {
    if ( ground.split(' ')[0] == 'not' ) {
        var foundIndex = beliefs.findIndex( (b) => { return b == ground.split(' ').splice(1).join(' ') } )
        beliefs.splice(foundIndex, 1)
    }
    else {
        var foundValue = beliefs.find( (b) => { return b == ground } )
        if ( !foundValue )
            beliefs.push(ground)
    }
}

module.exports = beliefs
