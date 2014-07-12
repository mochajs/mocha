global.required = (global.required || [])
global.required.push('c.js')

require('../../..').current.on('run', function() {
    beforeEach(function() {
        this.hooksAreWorking = true;
    })
})
