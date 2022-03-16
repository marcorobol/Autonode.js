
async function one () {

    for ( let i = 0; i < 100; i++ ) {
        console.log('one', i)
        await Promise.resolve()
    }

}


async function two () {

    for ( let i = 0; i < 100; i++ ) {
        console.log('two', i)
        console.log('two', i)
        await new Promise( res => setTimeout(res, 0))
    }

}

one()
two()