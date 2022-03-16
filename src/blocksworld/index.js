const Goal = require('../bdi/Goal')


class PickUp extends Goal {

    static parameters = ['ob']
    static precondition = [ ['clear', 'ob'], ['on-table', 'ob'], ['empty'] ]
    static effect = [ ['holding', 'ob'], ['not empty'], ['not clear', 'ob'], ['not on-table', 'ob'] ]

}

class PutDown extends Goal {

    static parameters = ['ob']
    static precondition = [ ['holding', 'ob'] ]
    static effect = [ ['holding', 'ob'], ['empty'], ['clear', 'ob'], ['on-table', 'ob'] ]

}

class Stack extends Goal {

    static parameters = ['x', 'y']
    static precondition = [ ['holding', 'x'], ['clear', 'y'] ]
    static effect = [ ['holding', 'x'], ['empty'], ['clear', 'x'], ['not clear', 'y'], ['on', 'x', 'y'] ]

}

class UnStack extends Goal {

    static parameters = ['x', 'y']
    static precondition = [ ['on', 'x', 'y'], ['clear', 'x'], ['empty'] ]
    static effect = [ ['holding', 'x'], ['not empty'], ['not clear', 'x'], ['clear', 'y'], ['not on', 'x', 'y'] ]

}



module.exports = {PickUp, PutDown, Stack, UnStack}