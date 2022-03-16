const Beliefset = require('./Beliefset')

describe('declare()', () => {
    var b = new Beliefset()
    test('declare() returns true', () => {
        expect(b.declare('on l1')).toBe(true);
    });
    test('re declare() at same value returns false', () => {
        expect(b.declare('on l1')).toBe(false);
    });
    test('fact.value is true', () => {
        expect(b.facts['on l1'].value).toBe(true);
        expect(b.facts['on l1'].observers.length).toBe(0);
    });
    test('literals is a map of fact => value, undefined if never declared', () => {
        expect(b.literals['on l1']).toBe(true);
        expect(b.literals['off']).toBe(undefined);
    });
    test('objects include args of declared fact', () => {
        expect(b.objects[0]).toBe('l1');
        expect(b.objects.length).toBe(1);
    });
})

describe('observe fact', () => {
    var b = new Beliefset()

    var notified = false
    var obs = (fact, value) => {notified = true}
    b.observe(obs, 'on')

    test('fact initial value is undefined', () => {
        expect(b.facts['on'].value).toBe(undefined);
    });

    test('declare() returns true', () => {
        expect(b.declare('on')).toBe(true);
    });

    test('fact final value is true', () => {
        expect(b.facts['on'].value).toBe(true);
    });

    test('observer get notified in case of a change to the fact', () => {
        expect(notified).toBe(true);
    });
})

describe('unobserve fact', () => {
    var b = new Beliefset()

    var notified = false
    var obs = (fact, value) => {notified = true}
    b.observe(obs, 'on')
    b.unobserve(obs, 'on')

    test('declare() returns true', () => {
        expect(b.declare('on')).toBe(true);
    });

    test('observer is not notified in case of a change to the fact', () => {
        expect(notified).toBe(false);
    });
})