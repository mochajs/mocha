'use strict';

const PluginLoader = require('../../lib/plugin-loader');
const sinon = require('sinon');
const {
  INVALID_PLUGIN_DEFINITION,
  INVALID_PLUGIN_IMPLEMENTATION
} = require('../../lib/errors').constants;

describe('plugin module', function() {
  describe('class PluginLoader', function() {
    describe('constructor', function() {
      describe('when passed no options', function() {
        it('should populate a registry of built-in plugins', function() {
          expect(new PluginLoader().registered.has('mochaHooks'), 'to be true');
        });
      });

      describe('when passed custom plugins', function() {
        it('should register the custom plugins', function() {
          const plugin = {exportName: 'mochaBananaPhone'};
          expect(
            new PluginLoader({pluginDefs: [plugin]}).registered,
            'to satisfy',
            new Map([['mochaBananaPhone', plugin]])
          );
        });
      });

      describe('when passed ignored plugins', function() {
        it('should retain a list of ignored plugins', function() {
          expect(
            new PluginLoader({
              ignore: ['elephantInRoom']
            }).ignoredExportNames,
            'to contain',
            'elephantInRoom'
          );
        });
      });
    });

    describe('static method', function() {
      describe('create()', function() {
        it('should return a PluginLoader instance', function() {
          expect(PluginLoader.create(), 'to be a', PluginLoader);
        });
      });
    });

    describe('instance method', function() {
      let pluginLoader;

      beforeEach(function() {
        pluginLoader = PluginLoader.create({
          ignore: ['elephantInRoom']
        });
      });

      describe('register()', function() {
        describe('when the plugin export name is not in use', function() {
          it('should not throw', function() {
            expect(
              () => pluginLoader.register({exportName: 'butts'}),
              'not to throw'
            );
          });
        });

        describe('when the plugin export name is already in use', function() {
          it('should throw', function() {
            const pluginDef = {exportName: 'butts'};
            pluginLoader.register(pluginDef);
            expect(() => pluginLoader.register(pluginDef), 'to throw', {
              code: INVALID_PLUGIN_DEFINITION,
              pluginDef
            });
          });
        });

        describe('when the plugin export name is ignored', function() {
          let pluginDef;

          beforeEach(function() {
            pluginDef = {exportName: 'elephantInRoom'};
          });

          it('should not throw', function() {
            expect(() => pluginLoader.register(pluginDef), 'not to throw');
          });

          it('should not register the plugin', function() {
            pluginLoader.register(pluginDef);
            expect(
              pluginLoader.registered,
              'not to have key',
              'elephantInRoom'
            );
          });
        });

        describe('when passed a falsy parameter', function() {
          it('should throw', function() {
            expect(() => pluginLoader.register(), 'to throw', {
              code: INVALID_PLUGIN_DEFINITION
            });
          });
        });

        describe('when passed a non-object parameter', function() {
          it('should throw', function() {
            expect(() => pluginLoader.register(1), 'to throw', {
              code: INVALID_PLUGIN_DEFINITION,
              pluginDef: 1
            });
          });
        });

        describe('when passed a definition w/o an exportName', function() {
          it('should throw', function() {
            const pluginDef = {foo: 'bar'};
            expect(() => pluginLoader.register(pluginDef), 'to throw', {
              code: INVALID_PLUGIN_DEFINITION,
              pluginDef
            });
          });
        });
      });

      describe('load()', function() {
        let pluginLoader;

        beforeEach(function() {
          pluginLoader = PluginLoader.create();
        });

        describe('when called with a falsy value', function() {
          it('should return false', function() {
            expect(pluginLoader.load(), 'to be false');
          });
        });

        describe('when called with an object containing no recognized plugin', function() {
          it('should return false', function() {
            // also it should not throw
            expect(
              pluginLoader.load({mochaBananaPhone: () => {}}),
              'to be false'
            );
          });
        });

        describe('when called with an object containing a recognized plugin', function() {
          let plugin;
          let pluginLoader;

          beforeEach(function() {
            plugin = {
              exportName: 'mochaBananaPhone',
              validate: sinon.spy()
            };
            pluginLoader = PluginLoader.create({pluginDefs: [plugin]});
          });

          it('should return true', function() {
            const func = () => {};
            expect(pluginLoader.load({mochaBananaPhone: func}), 'to be true');
          });

          it('should retain the value of any matching property in its mapping', function() {
            const func = () => {};
            pluginLoader.load({mochaBananaPhone: func});
            expect(
              pluginLoader.loaded,
              'to satisfy',
              new Map([['mochaBananaPhone', [func]]])
            );
          });

          it('should call the associated validator, if present', function() {
            const func = () => {};
            pluginLoader.load({mochaBananaPhone: func});
            expect(plugin.validate, 'was called once');
          });
        });
      });

      describe('load()', function() {
        let pluginLoader;
        let fooPlugin;
        let barPlugin;

        beforeEach(function() {
          fooPlugin = {
            exportName: 'foo',
            validate: sinon.stub()
          };
          fooPlugin.validate.withArgs('ERROR').throws();
          barPlugin = {
            exportName: 'bar',
            validate: sinon.stub()
          };
          pluginLoader = PluginLoader.create({
            pluginDefs: [fooPlugin, barPlugin]
          });
        });

        describe('when passed a falsy or non-object value', function() {
          it('should return false', function() {
            expect(pluginLoader.load(), 'to be false');
          });

          it('should not call a validator', function() {
            expect([fooPlugin, barPlugin], 'to have items satisfying', {
              validate: expect.it('was not called')
            });
          });
        });

        describe('when passed an object value', function() {
          describe('when no keys match any known named exports', function() {
            let retval;

            beforeEach(function() {
              retval = pluginLoader.load({butts: () => {}});
            });

            it('should return false', function() {
              expect(retval, 'to be false');
            });
          });

          describe('when a key matches a known named export', function() {
            let retval;
            let impl;

            beforeEach(function() {
              impl = sinon.stub();
            });

            it('should call the associated validator', function() {
              retval = pluginLoader.load({foo: impl});

              expect(fooPlugin.validate, 'to have a call satisfying', [
                impl
              ]).and('was called once');
            });

            it('should not call validators whose keys were not found', function() {
              retval = pluginLoader.load({foo: impl});
              expect(barPlugin.validate, 'was not called');
            });

            describe('when the value passes the associated validator', function() {
              beforeEach(function() {
                retval = pluginLoader.load({foo: impl});
              });

              it('should return true', function() {
                expect(retval, 'to be true');
              });

              it('should add the implementation to the internal mapping', function() {
                expect(
                  pluginLoader.loaded,
                  'to satisfy',
                  new Map([['foo', expect.it('to have length', 1)]])
                );
              });

              it('should not add an implementation of plugins not present', function() {
                expect(
                  pluginLoader.loaded,
                  'to satisfy',
                  new Map([['bar', expect.it('to be empty')]])
                );
              });
            });

            describe('when the value does not pass the associated validator', function() {
              it('should throw', function() {
                expect(() => pluginLoader.load({foo: 'ERROR'}), 'to throw');
              });
            });
          });
        });
      });

      describe('finalize()', function() {
        let pluginLoader;
        let fooPlugin;
        let barPlugin;
        let bazPlugin;

        beforeEach(function() {
          fooPlugin = {
            exportName: 'foo',
            optionName: 'fooOption',
            validate: sinon.stub(),
            finalize: impls => impls.map(() => 'FOO')
          };
          fooPlugin.validate.withArgs('ERROR').throws();
          barPlugin = {
            exportName: 'bar',
            validate: sinon.stub(),
            finalize: impls => impls.map(() => 'BAR')
          };
          bazPlugin = {
            exportName: 'baz'
          };
          pluginLoader = PluginLoader.create({
            pluginDefs: [fooPlugin, barPlugin, bazPlugin]
          });
        });

        describe('when no plugins have been loaded', function() {
          it('should return an empty map', async function() {
            return expect(pluginLoader.finalize(), 'to be fulfilled with', {});
          });
        });

        describe('when a plugin has one or more implementations', function() {
          beforeEach(function() {
            pluginLoader.load({foo: sinon.stub()});
            pluginLoader.load({foo: sinon.stub()});
          });

          it('should return an object map using `optionName` key for each registered plugin', async function() {
            return expect(pluginLoader.finalize(), 'to be fulfilled with', {
              fooOption: ['FOO', 'FOO']
            });
          });

          it('should omit unused plugins', async function() {
            pluginLoader.load({bar: sinon.stub()});
            return expect(pluginLoader.finalize(), 'to be fulfilled with', {
              fooOption: ['FOO', 'FOO'],
              bar: ['BAR']
            });
          });
        });

        describe('when a plugin has no "finalize" function', function() {
          it('should return an array of raw implementations', function() {
            pluginLoader.load({baz: 'polar bears'});
            return expect(pluginLoader.finalize(), 'to be fulfilled with', {
              baz: ['polar bears']
            });
          });
        });
      });
    });
  });

  describe('root hooks plugin 🎣', function() {
    let pluginLoader;

    beforeEach(function() {
      pluginLoader = PluginLoader.create();
    });

    describe('when impl is an array', function() {
      it('should fail validation', function() {
        expect(() => pluginLoader.load({mochaHooks: []}), 'to throw', {
          code: INVALID_PLUGIN_IMPLEMENTATION
        });
      });
    });

    describe('when impl is a primitive', function() {
      it('should fail validation', function() {
        expect(() => pluginLoader.load({mochaHooks: 'nuts'}), 'to throw', {
          code: INVALID_PLUGIN_IMPLEMENTATION
        });
      });
    });

    describe('when impl is a function', function() {
      it('should pass validation', function() {
        expect(pluginLoader.load({mochaHooks: sinon.stub()}), 'to be true');
      });
    });

    describe('when impl is an object of functions', function() {
      // todo: hook name validation?
      it('should pass validation');
    });

    describe('when a loaded impl is finalized', function() {
      it('should flatten the implementations', async function() {
        function a() {}
        function b() {}
        function d() {}
        function g() {}
        async function f() {}
        function c() {
          return {
            beforeAll: d,
            beforeEach: g
          };
        }
        async function e() {
          return {
            afterEach: f
          };
        }

        [
          {
            beforeEach: a
          },
          {
            afterAll: b
          },
          c,
          e
        ].forEach(impl => {
          pluginLoader.load({mochaHooks: impl});
        });

        return expect(pluginLoader.finalize(), 'to be fulfilled with', {
          rootHooks: {
            beforeAll: [d],
            beforeEach: [a, g],
            afterAll: [b],
            afterEach: [f]
          }
        });
      });
    });
  });

  describe('global fixtures plugin', function() {
    let pluginLoader;

    beforeEach(function() {
      pluginLoader = PluginLoader.create();
    });

    describe('global setup', function() {
      describe('when an implementation is a primitive', function() {
        it('should fail validation', function() {
          expect(
            () => pluginLoader.load({mochaGlobalSetup: 'nuts'}),
            'to throw'
          );
        });
      });
      describe('when an implementation is an array of primitives', function() {
        it('should fail validation', function() {
          expect(
            () => pluginLoader.load({mochaGlobalSetup: ['nuts']}),
            'to throw'
          );
        });
      });

      describe('when an implementation is a function', function() {
        it('should pass validation', function() {
          expect(
            pluginLoader.load({mochaGlobalSetup: sinon.stub()}),
            'to be true'
          );
        });
      });

      describe('when an implementation is an array of functions', function() {
        it('should pass validation', function() {
          expect(
            pluginLoader.load({mochaGlobalSetup: [sinon.stub()]}),
            'to be true'
          );
        });
      });
    });

    describe('global teardown', function() {
      describe('when an implementation is a primitive', function() {
        it('should fail validation', function() {
          expect(
            () => pluginLoader.load({mochaGlobalTeardown: 'nuts'}),
            'to throw'
          );
        });
      });
      describe('when an implementation is an array of primitives', function() {
        it('should fail validation', function() {
          expect(
            () => pluginLoader.load({mochaGlobalTeardown: ['nuts']}),
            'to throw'
          );
        });
      });

      describe('when an implementation is a function', function() {
        it('should pass validation', function() {
          expect(
            pluginLoader.load({mochaGlobalTeardown: sinon.stub()}),
            'to be true'
          );
        });
      });

      describe('when an implementation is an array of functions', function() {
        it('should pass validation', function() {
          expect(
            pluginLoader.load({mochaGlobalTeardown: [sinon.stub()]}),
            'to be true'
          );
        });
      });
    });
  });
});
