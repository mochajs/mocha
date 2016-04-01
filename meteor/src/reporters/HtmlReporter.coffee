BaseReporter      = require("./BaseReporter")
{ObjectLogger}    = require("meteor/practicalmeteor:loglevel")
MochaHtmlReporter = require("./html")

log = new ObjectLogger('HtmlReporter', 'info')

class HtmlReporter extends BaseReporter

  constructor: (@clientRunner, @serverRunner, @options = {})->
    try
      log.enter('constructor')
      @addReporterHtml()

      @reporter = new MochaHtmlReporter(@clientRunner)
      @serverReporter = new MochaHtmlReporter(@serverRunner, {
        elementIdPrefix: 'server-'
      })
    finally
      log.return()

  ###
    Adds the html required by the mocha HTML reporter to the body of the html
    document. We modified the mocha HTML reporter to be able to display 2 reporters
    at the same time, one for client tests and one for server tests.
    TODO: Create a single meteor reactive reporter.
  ###
  addReporterHtml: ()=>
    try
      log.enter("addReporterHtml")
      div = document.createElement('div')
      div.className = 'mocha-wrapper'

      div.innerHTML = '<div class="content">
        <div class="test-wrapper">
          <h1 class="title">Client tests</h1>

          <div id="mocha" class="mocha"></div>
        </div>

        <div class="divider"></div>

        <div class="test-wrapper">
          <h1 class="title">Server tests</h1>

          <div id="server-mocha" class="mocha"></div>
        </div>
      </div>'

      document.body.appendChild(div)
    finally
      log.return()



module.exports = HtmlReporter
