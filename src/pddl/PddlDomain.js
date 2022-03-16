const fs = require('fs')



class PddlDomain {
    
    constructor (name, predicates = [], actions = []) {
        this.name = name
        this.predicates = predicates
        this.actions = actions
    }

    addPredicate (predicate) { // predicate = ['light-on', 'l']
        if ( this.predicates.find( (e) => e[0]==predicate[0]) )
            return false
        this.predicates.push(predicate)
        predicate.toPddlString = function () {
            return '('+predicate[0]+' ' + predicate.slice(1).map( v => '?'+v ).join(' ') + ')'
        }
        return predicate
    }

    addAction (...actionClasses) {
        for (let actionClass of actionClasses) {
            
            let {parameters, precondition, effect} = actionClass

            for ( let p of precondition ) {
                let not = p[0].split(' ')[0]=='not'
                let predicate = (not ? p[0].split(' ')[1] : p[0])
                let args = p.slice(1)
                this.addPredicate([predicate, ...args])
            }

            for ( let p of effect ) {
                let not = p[0].split(' ')[0]=='not'
                let predicate = (not ? p[0].split(' ')[1] : p[0])
                let args = p.slice(1)
                this.addPredicate([predicate, ...args])
            }

            this.actions.push(actionClass)
            actionClass.toPddlString = function () {
                return `
        (:action ${actionClass.name}
            :parameters (${parameters.map( p => '?'+p ).join(' ')})
            :precondition (and ${precondition.map( p => '('+p[0]+' ' + p.slice(1).map( v => '?'+v ).join(' ') + ')').join(' ')} )
            :effect (and
                ${effect.map( p => {
                    let not = p[0].split(' ')[0]=='not'
                    let predicate = (not ? p[0].split(' ')[1] : p[0])
                    let args = p.slice(1).map( v => '?'+v ).join(' ')
                    if (not)
                        return '(not (' + predicate + ' ' + args + '))'
                    return '(' + predicate + ' ' + args + ')'
                }).join('\n\t\t\t')}
            )
        )`
            }
        
        }
    }

    saveToFile () {

        const content = `\
;; domain file: domain-${this.name}.pddl
(define (domain ${this.name})
    (:requirements :strips)
    (:predicates
        ${this.predicates.map( p => p.toPddlString()).join('\n\t\t')}              
    )
    ${this.actions.map( a => a.toPddlString()).join('\n\t\t') }
)`

        var path = './tmp/domain-'+this.name+'.pddl'
        
        return new Promise( (res, rej) => {

            fs.writeFile(path, content, err => {
                if (err)
                    rej(err)
                else // console.log("File written successfully");
                    res(path)
            })

        })

    }

}



// const { LightOn } = desires = require('../lightsworld/lights.desires')
// var lightDomain = new PddlDomain('lights')
// lightDomain.addPredicate(['switched-on', 'l'])
// lightDomain.addPredicate(['switched-off', 'l'])
// lightDomain.addAction(LightOn)
// lightDomain.saveToFile()



module.exports = PddlDomain